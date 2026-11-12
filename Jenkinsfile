
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        DOCKERHUB_REPO = 'adarshinfinia/healthflow'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Secret Scan - Gitleaks') {
            steps {
                sh '''
                    gitleaks detect --source . --redact --exit-code 1
                '''
            }
        }

        stage('Trivy Filesystem Scan') {
            steps {
                sh '''
                    trivy fs \
                      --scanners vuln,misconfig \
                      --severity HIGH,CRITICAL \
                      --ignorefile .trivyignore \
                      --exit-code 1 \
                      --no-progress .
                '''
            }
        }

        stage('Install Dependencies and Test') {
            steps {
                sh '''
                    npm ci
                    npm test
                    npm audit --audit-level=high
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                      -t ${DOCKERHUB_REPO}:ci-${BUILD_NUMBER} \
                      -t ${DOCKERHUB_REPO}:latest .
                '''
            }
        }

        stage('Trivy Docker Image Scan') {
            steps {
                sh '''
                    trivy image \
                      --scanners vuln \
                      --severity HIGH,CRITICAL \
                      --exit-code 1 \
                      --no-progress \
                      ${DOCKERHUB_REPO}:ci-${BUILD_NUMBER}
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

                        docker push ${DOCKERHUB_REPO}:ci-${BUILD_NUMBER}
                        docker push ${DOCKERHUB_REPO}:latest

                        docker logout
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'HealthFlow CI pipeline completed successfully!'

            build job: 'HealthFlow-BlueGreen',
                wait: false,
                parameters: [
                    string(name: 'TARGET_COLOR', value: 'auto'),
                    string(name: 'IMAGE_TAG', value: "ci-${env.BUILD_NUMBER}")
                ]
        }

        failure {
            echo 'HealthFlow CI pipeline failed. Deployment will not be triggered.'
        }
    }
}
