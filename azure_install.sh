#!/bin/bash

mkdir azure
cd azure
git clone https://gitlabrunner:Gts%2527_217AZC%23%24%252_982@gitlab.3angletech.com/UnitPalDK/UnitPal.git --branch master
cd UnitPal
(git remote add azure https://unitpalth:UnPL3%242_2%40suT21@unitpal.scm.azurewebsites.net:443/UnitPal.git) || echo "Azure remote already added"
git push azure master
cd ../../
rm -rf azure
echo "Finished install on Azure"
