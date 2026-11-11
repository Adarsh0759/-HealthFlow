pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        DOCKERHUB_REPO = 'adarshinfinia/healthflow'
        KUBECONFIG = '/var/lib/jenkins/.kube/jenkins-deployer.kubeconfig'
        K8S_NAMESPACE = 'healthflow'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies and Test') {
            steps {
                sh '''
                    npm ci
                    npm test
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                      -t ${DOCKERHUB_REPO}:${BUILD_NUMBER} \
                      -t ${DOCKERHUB_REPO}:latest .
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        set +x
                        echo "$DOCKER_PASS" | docker login \
                          -u "$DOCKER_USER" --password-stdin

                        docker push ${DOCKERHUB_REPO}:${BUILD_NUMBER}
                        docker push ${DOCKERHUB_REPO}:latest

                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl apply -f k8s/deployment.yaml
                    kubectl apply -f k8s/service.yaml
                    kubectl apply -f k8s/ingress.yaml

                    kubectl set image deployment/healthflow \
                      healthflow=${DOCKERHUB_REPO}:${BUILD_NUMBER} \
                      -n ${K8S_NAMESPACE}

                    kubectl rollout status deployment/healthflow \
                      -n ${K8S_NAMESPACE} --timeout=120s
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    kubectl get pods -n ${K8S_NAMESPACE}
                    kubectl get services -n ${K8S_NAMESPACE}
                    kubectl get ingress -n ${K8S_NAMESPACE}
                '''
            }
        }
    }

    post {
        success {
            echo 'HealthFlow CI/CD pipeline completed successfully!'
        }
        failure {
            echo 'HealthFlow CI/CD pipeline failed. Check the stage logs.'
        }
    }
}
