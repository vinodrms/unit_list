mkdir azure
cd azure
git clone $1 --branch master || exit 1
cd UnitPal/ansible
ansible-playbook -i production --private-key=~/.ssh/unitpal_rsa -u unitpal unitpal_update.yml
cd ../../../
rm -rf azure
echo "Finished install on Azure"