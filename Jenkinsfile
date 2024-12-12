pipeline {
    agent any

    environment {
        // Git Repository
        REPO_NAME = 'Chvald27/DevOpsProject'
        BRANCH_NAME = 'develop'

        // Docker Image Details
        IMAGE_NAME = 'webapp'
        IMAGE_TAG = 'latest'
        IMAGE_VERSION_TAG = 'v1'

        // Docker Hub credentials
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
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
                    # Install required dependencies
                    ssh -o StrictHostKeyChecking=no ubuntu@15.223.184.199 "
                        sudo apt-get update &&
                        sudo apt-get install -y libpq-dev
                    "

                    # Transfer application files to the VM
                    scp -o StrictHostKeyChecking=no -r app/ config.py flask_session k8s requirements.txt run.py terraform ubuntu@15.223.184.199:/home/ubuntu/

                    # Run unit tests
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
                        sudo docker build -t webapp:latest .
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

