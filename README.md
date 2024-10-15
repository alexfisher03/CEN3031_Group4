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

**Use separate terminals for frontend/backend**

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-repo-link.git
   cd CEN3031_GROUP4

---
### Project Setup

##### Prerequisites
- Node.js 
- Python 3.10+
- Django
- npm
- Git

#### Installation

**use seperate terminals for frontend/backend**

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



