# HealthFlow DevSecOps Security Exceptions

## KSV-0056 – Kubernetes Service modification

Severity: HIGH
Scanner: Trivy
Affected file: k8s/jenkins-rbac.yaml
Affected resource: Service/healthflow

### Reason
The Jenkins Blue-Green deployment pipeline must patch the
healthflow Kubernetes Service selector to switch production
traffic between Blue and Green deployments.

### Security controls
- Jenkins uses a dedicated Kubernetes ServiceAccount.
- Permissions are restricted to the healthflow namespace.
- Service permissions are restricted using resourceNames:
  ["healthflow"].
- Jenkins can only get and patch this Service.
- Jenkins cannot create or delete Services.
- Jenkins cannot modify Ingresses or access Kubernetes Secrets.
- Deployment permissions are restricted to the required operations.

### Risk acceptance
This permission is necessary for the current Blue-Green architecture.
The remaining KSV-0056 finding is an accepted, documented exception,
not a resolved vulnerability.

### Review condition
Reassess this exception if the deployment architecture changes.
