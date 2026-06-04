@echo off
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot
set ANDROID_HOME=C:\Users\NEGI JI\android-sdk
cd /d E:\Yuvi\Codes\OpenCode\level-up\android
call gradlew.bat clean
call gradlew.bat assembleDebug
xcopy /y /q app\build\outputs\apk\debug\app-debug.apk ..\public\level-up.apk
echo APK copied to public/level-up.apk
