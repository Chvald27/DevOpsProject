pipeline {
    agent any
    environment {
        SERVER_IP = '15.223.184.199'
    }
    stages {
        stage('Cleanup') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Copy Files to Remote Server') {
            steps {
                sshagent(['Docker_VM']) {
                    sh '''
                        ssh ubuntu@${SERVER_IP} "mkdir -p /opt/DevOpsProject"
                        scp -r * ubuntu@${SERVER_IP}:/opt/DevOpsProject/
                    '''
                }
            }
        }

        stage('Build Image') {
            steps {
                sshagent(['Docker_VM']) {
                    sh '''
                        ssh ubuntu@${SERVER_IP} "cd /opt/DevOpsProject && docker build -t flask-app:develop-${BUILD_ID} ."
                    '''
                }
            }
        }

        stage('Run Container') {
            steps {
                sshagent(['Docker_VM']) {
                    sh '''
                        ssh ubuntu@${SERVER_IP} "
                            docker ps -a --filter 'name=flask-app-container' | grep flask-app-container && docker stop flask-app-container && docker rm flask-app-container || true
                            docker run --name flask-app-container -d -p 8081:80 flask-app:develop-${BUILD_ID}
                        "
                    '''
                }
            }
        }

        stage('Test Website') {
            steps {
                sh '''
                    curl -f -I http://${SERVER_IP}:8081 || exit 1
                '''
            }
        }

        stage('Push Image') {
            steps {
                sshagent(['Docker_VM']) {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-auth', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh '''
                            ssh ubuntu@${SERVER_IP} "
                                docker login -u $USERNAME -p $PASSWORD &&
                                docker tag flask-app:develop-${BUILD_ID} $USERNAME/flask-app:latest &&
                                docker tag flask-app:develop-${BUILD_ID} $USERNAME/flask-app:develop-${BUILD_ID} &&
                                docker push $USERNAME/flask-app:latest &&
                                docker push $USERNAME/flask-app:develop-${BUILD_ID}
                            "
                        '''
                    }
                }
            }
        }
    }
}


