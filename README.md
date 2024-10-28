# Development Environment for CEN3031 (Intro to Software Engineering)
---
#### CEN3031_Group4
##### Group Name: The Bug Squashers
##### Group Members: Alexander Fisher, Chloe Bai, Nora Choukri, Nicholas Tayag
---

### Project Setup

##### Prerequisites
- Node.js 
- Python 3.10+
- Django
- npm
- Git

#### Installation

**use separate terminals for frontend/backend**

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-repo-link.git
   cd CEN3031_GROUP4
   ```
2. **Set up Virtual Environment:**
   ```bash
   python -m venv env
   source env/bin/activate
   ```
3. **Install Backend stuff**
   ```bash
   pip install -r requirements.txt
   ```
4. **Frontend Setup**
   ```bash
   cd frontend
   npm install 
   ```
5. **Backend Setup**
   ```bash
   cd backend
   python manage.py migrate
   ```
6. **Running Servers**

   **Backend**
   ```bash
   python manage.py runserver
   ```
   **Frontend**
   ```bash
   npm start
   ```

#### Contributing

1. **Create new branch**
   ```bash
   git checkout -b <branch-name>
   ```
2. **Commit Changes**
   ```bash
   git commit -m "msg"
   ```
3. **Push to Github**
   ```bash
   git push origin ( use "-u" here if new branch) <branch-name)
   ```
3. **Submit PR**


### For Testing
---
1. In the ```backend``` directory, run the command: 
   - ```python manage.py createsuperuser```
   
   Proceed to create your admin credentials

2. Once you have created your super user, navigate to:
   - ```http://127.0.0.1:8000/admin/```
   - Sign in using your newly created credentials

3. Now you can see the admin dashboard for Django 
   
   ```TO TEST THE APP```:
   - Navigate to ```http://localhost:3000/```
   - Login to the application using the same ```SUPERUSER``` credentials you created
   - Now you can test the application out and monitor any changes made on the frontend directly via the ```admin interface```
