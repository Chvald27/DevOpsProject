kpipeline {
    agent any

    environment {
        // Git Repository
        REPO_NAME = 'Chvald27/DevOpsProject'
        BRANCH_NAME = 'develop'

        // Docker Image Details
        IMAGE_NAME = 'webapp'
        IMAGE_TAG = 'latest'

        // Kubernetes Config File (stored as Jenkins credential)
        KUBE_CONFIG = credentials('kube-config') // Ensure kube-config is added in Jenkins credentials
    }

    stages {
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
                    ssh -o StrictHostKeyChecking=no ubuntu@15.223.184.199 'docker --version'
                    '''
                }
            }
        }

        stage('Build and Test') {
            steps {
                // Setup Python environment and run tests
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
                docker build -t $IMAGE_NAME:$IMAGE_TAG .
                '''
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    // Login to DockerHub and push image
                    sh '''
                    docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
                    docker tag $IMAGE_NAME:$IMAGE_TAG $DOCKER_USERNAME/$IMAGE_NAME:$IMAGE_TAG
                    docker push $DOCKER_USERNAME/$IMAGE_NAME:$IMAGE_TAG
                    '''
                }
            }
        }

	stage('Deploy to EKS') {
    	    steps {
        	sh '''
        	export KUBECONFIG=~/.kube/config
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

