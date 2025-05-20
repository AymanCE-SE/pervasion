@echo off
echo Cleaning up unnecessary files...

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

echo Cleanup complete!
