@echo off
echo Cleaning up unnecessary files in the project...

echo.
echo Cleaning up backend files...
cd backend

echo Removing temporary setup files...
if exist temp_env_setup.py del temp_env_setup.py
if exist fix_env.bat del fix_env.bat
if exist setup_fix.ps1 del setup_fix.ps1

echo Removing duplicate setup files...
if exist simple_setup.bat del simple_setup.bat

echo Removing test files...
if exist create_test_user.py del create_test_user.py
if exist test_api.py del test_api.py
if exist test_api_data.py del test_api_data.py
if exist api_test_results.json del api_test_results.json
if exist api_data_results.json del api_data_results.json

echo Removing redundant environment files...
if exist .env.new del .env.new

echo Removing test database file...
if exist db.sqlite3 del db.sqlite3

echo Removing redundant middleware file...
if exist api\middleware.py del api\middleware.py

cd ..

echo.
echo Cleaning up frontend files...
cd frontend

echo Removing redundant files...
if exist src\components\ApiTest.jsx del src\components\ApiTest.jsx
if exist src\components\test\ErrorTest.jsx del src\components\test\ErrorTest.jsx
if exist src\services\api.js del src\services\api.js

echo Removing backup files...
for /r %%G in (*.bak) do del "%%G"
for /r %%G in (*.swp) do del "%%G"
for /r %%G in (*~) do del "%%G"

cd ..

echo.
echo Cleanup complete!
echo The project structure is now cleaner and more maintainable.
