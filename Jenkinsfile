pipeline {
    agent any

    environment {
        // AWS Credentials
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')

        // Docker Registry Credentials
        DOCKER_USERNAME = credentials('docker-username')
        DOCKER_PASSWORD = credentials('docker-password')

        // Git Repository
        REPO_NAME = 'Chvald27/DevOpsProject'
        BRANCH_NAME = 'develop'

        // Docker Image Details
        IMAGE_NAME = 'webapp'
        IMAGE_TAG = 'latest'

        // Kubernetes Details
        KUBE_CONFIG = credentials('kube-config') // Kubernetes config for access
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Clone the Git repository
                checkout scm
            }
        }

        stage('Build and Test') {
            steps {
                // Setup Python environment
                sh '''
                python3 -m venv venv
                source venv/bin/activate
                pip install -r requirements.txt
                python -m unittest discover -s app/tests
                '''
            }
        }

        stage('Docker Build') {
            steps {
                // Build Docker image
                sh '''
                docker build -t $DOCKER_USERNAME/$IMAGE_NAME:$IMAGE_TAG .
                '''
            }
        }

        stage('Docker Push') {
            steps {
                withDockerRegistry([credentialsId: 'docker-hub-credentials', url: '']) {
                    // Push Docker image to DockerHub
                    sh '''
                    docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
                    docker push $DOCKER_USERNAME/$IMAGE_NAME:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                // Deploy application to Kubernetes
                sh '''
                export KUBECONFIG=$KUBE_CONFIG
                kubectl apply -f k8s/deployment.yaml
                kubectl apply -f k8s/service.yaml
                '''
            }
        }
    }

    post {
        always {
            echo "Pipeline completed."
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}

