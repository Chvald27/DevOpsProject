pipeline {
    agent any
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
                sshagent(['docker-server']) {
                    sh '''
		    scp -r * root@:/opt/DevOpsProject/
 
                    '''
                }
            }
        }
 
        stage('Build Image') {
            steps {
                sshagent(['docker-server']) {
                    sh '''
                    ssh root@15.223.184.199 "cd /opt/DevOpsProject && docker build -t flask-app:develop-${BUILD_ID} ."
                    '''
                }
            }
        }
 
        stage('Run Container') {
            steps {
                sshagent(['docker-server']) {
                    sh '''
                    ssh root@15.223.184.199 "docker stop flask-app-container || true && docker rm flask-app-container || true && docker run --name flask-app-container -d -p 8080:8080 
flask-app:develop-${BUILD_ID}"
                    '''
                }
            }
        }
 
        stage('Test Website') {
            steps {
                sshagent(['docker-server']) {
                    sh '''
                    ssh root@15.223.184.199 "curl -I http://15.223.184.199:8080"
                    '''
                }
            }
        }
 
        stage('Push Image') {
            steps {
                sshagent(['docker-server']) {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-auth', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh '''
                        ssh root@15.223.184.199 "docker tag flask-app:develop-${BUILD_ID} $USERNAME/flask-app:latest"
                        ssh root@15.223.184.199 "docker tag flask-app:develop-${BUILD_ID} $USERNAME/flask-app:develop-${BUILD_ID}"
                        ssh root@15.223.184.199 "docker push $USERNAME/flask-app:latest"
                        ssh root@15.223.184.199 "docker push $USERNAME/flask-app:develop-${BUILD_ID}"
                        '''
                    }
                }
            }
        }
    }
}
