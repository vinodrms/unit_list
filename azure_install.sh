#!/bin/bash

mkdir azure
cd azure
git clone https://gitlab.3angletech.com/UnitPalDK/UnitPal.git
cd UnitPal
(git remote add azure https://unitpalprod:UnPL3%242_2%40suT21@unitpalprod.scm.azurewebsites.net:443/UnitPalProd.git) || echo "Azure remote already added"
git push azure master
cd ../../
rm -rf azure
echo "Finished install on Azure"