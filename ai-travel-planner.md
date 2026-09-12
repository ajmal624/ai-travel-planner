#ai-travel-planner

Unzip the File
use internet for all installation

Install Python 3.14, then verify the installation:
    Press Windows + R, type `cmd`, and press Enter.
    In Command Prompt, run:
        python --version

Install Node.Js, then verify the installation:
    Press Windows + R, type `cmd`, and press Enter.
    In Command Prompt, run:
        Node -v
		npm -v

Open Visual Studio Code and install the required Python, Node extensions.

Go to File → New Window → Open Folder, then select the `ai-travel-planner` folder.

Open the terminal and run:
	cd backend
    py -m venv .venv
    venv\Scripts\Activate
    pip install -r requirements.txt
	python manage.py runserver
	Then create a '+' icon to create new terminal then type:
	cd frontend
	npm install
	npm run dev

Logout the page, select Create account:
    Username: ajmal
    Email: ajmal@example.com
    Password: ajmal12345

Create a trip:
    Trip title: Dubai Holiday
    City: Dubai
    Country: United Arab Emirates
    Start date: 2026-10-10
    End date: 2026-10-14
    Number of travelers: 2
    Budget: Moderate
    Preferred pace: Balanced
    Interests: food, shopping, history, art

View Dashboard and AI Planner