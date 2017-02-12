#!/bin/bash

mkdir azure
cd azure
git clone https://gitlabrunner:Gts%2527_217AZC%23%24%252_982@gitlab.3angletech.com/UnitPalDK/UnitPal.git --branch 101-configure-linux-vm-on-azure
cd UnitPal/ansible
ansible-playbook -i production --private-key=~/.ssh/unitpal_rsa -u unitpal unitpal_update.yml
# cd ../../../
# rm -rf azure
echo "Finished install on Azure"
