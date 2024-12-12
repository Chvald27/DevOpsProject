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
        KUBE_CONFIG = credentials('kube-config') // Ensure kube-config is added in Jenkins credentials
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
                    ssh -o StrictHostKeyChecking=no ubuntu@15.223.184.199 docker --version || echo "Docker not found"
                    '''
                }
            }
        }


stage('Build and Test') {
    steps {
        sshagent(['Docker_VM']) {
            sh '''
            # Ensure dependencies are installed
            ssh -o StrictHostKeyChecking=no ubuntu@15.223.184.199 "
                sudo apt-get update &&
                sudo apt-get install -y libpq-dev
            "

            # Transfer application files
            scp -o StrictHostKeyChecking=no -r app/ config.py flask_session k8s requirements.txt run.py terraform ubuntu@15.223.184.199:/home/ubuntu/

            # Run tests
            ssh -o StrictHostKeyChecking=no ubuntu@15.223.184.199 "
                cd /home/ubuntu &&
                python3 -m venv venv &&
                source venv/bin/activate &&
                pip install -r requirements.txt &&
                python -m unittest discover -s /home/ubuntu/app/tests -p 'test_*.py'
            "
            '''
        }
    }
}

        stage('Docker Build') {
            steps {
                sshagent(['Docker_VM']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@15.223.184.199 "
                        cd /home/ubuntu/app &&
                        docker build -t $IMAGE_NAME:$IMAGE_TAG .
                    "
                    '''
                }
            }
        }

        stage('Docker Push') {
            steps {
                sshagent(['Docker_VM']) {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@15.223.184.199 "
                            docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD &&
                            docker tag $IMAGE_NAME:$IMAGE_TAG $DOCKER_USERNAME/$IMAGE_NAME:$IMAGE_TAG &&
                            docker push $DOCKER_USERNAME/$IMAGE_NAME:$IMAGE_TAG
                        "
                        '''
                    }
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                withEnv(["KUBECONFIG=${env.KUBE_CONFIG}"]) {
                    sh '''
                    kubectl apply -f k8s/deployment.yaml
                    kubectl apply -f k8s/service.yaml
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

