pipeline {
    agent any

    environment {
        // Git Repository
        REPO_NAME = 'Chvald27/DevOpsProject'
        BRANCH_NAME = 'develop'

        // Docker Image Details
        IMAGE_NAME = 'webapp'
        IMAGE_TAG = 'latest'

        // Kubernetes Config File (stored as Jenkins credential)
        KUBECONFIG = credentials('kube-config') // Ensure kube-config is added in Jenkins credentials
    }

    stages {

        stage('Cleanup Workspace') {
            steps {
                deleteDir() // Deletes the workspace
            }
        }

        stage('Checkout Code') {
            steps {
                // Clone the Git repository
                checkout scm
            }
        }

        stage('Access Docker VM') {
            steps {
                sshagent(['Docker_VM']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@15.223.184.199 'docker --version || echo "Docker not found"'
                    '''
                }
            }
        }

        stage('Build and Test') {
            steps {
                // Ensure Python is installed and virtual environment is created properly
        	sh '''
        	# Check if Python is available
        	which python3 || { echo "Python3 is not installed"; exit 1; }
        
        	# Create virtual environment
        	python3 -m venv venv || { echo "Failed to create virtual environment. Ensure python3-venv is installed."; exit 1; }
        
        	# Activate and set up the virtual environment
        	source venv/bin/activate
        	pip install --upgrade pip
        	pip install -r requirements.txt || { echo "Failed to install requirements"; exit 1; }

        	# Run tests
        	python -m unittest discover -s app/tests || { echo "Tests failed"; exit 1; }
        	'''            
	    }
        }

        stage('Docker Build') {
            steps {
                sshagent(['Docker_VM']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@15.223.184.199 '
                    docker build -t $IMAGE_NAME:$IMAGE_TAG .
                    ' || (echo "Docker build failed" && exit 1)
                    '''
                }
            }
        }

        stage('Docker Push') {
            steps {
                sshagent(['Docker_VM']) {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@15.223.184.199 '
                        docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
                        docker tag $IMAGE_NAME:$IMAGE_TAG $DOCKER_USERNAME/$IMAGE_NAME:$IMAGE_TAG
                        docker push $DOCKER_USERNAME/$IMAGE_NAME:$IMAGE_TAG
                        ' || (echo "Docker push failed" && exit 1)
                        '''
                    }
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                withEnv(["KUBECONFIG=${KUBECONFIG}"]) {
                    sh '''
                    kubectl apply -f k8s/deployment.yaml || (echo "Failed to deploy deployment.yaml" && exit 1)
                    kubectl apply -f k8s/service.yaml || (echo "Failed to deploy service.yaml" && exit 1)
                    '''
                }
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

