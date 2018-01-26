if [ $# != 1 ]
  then
    echo "Please provide the environment as input" && exit
fi

case $1 in
  production|staging) echo "Deploying for $1";;
  *)  echo "Incorrect environment" && exit;;
esac

environment=$1

case $environment in
  staging)
    inventory="staging"
    branch="566-demo-api-for-booking-com"
    ;;
  production)
    inventory="production"
    branch="master"
    ;;
esac

echo $inventory $branch
mkdir $environment
cd $environment
git clone https://gitlabrunner:Gts%2527_217AZC%23%24%252_982@gitlab.3angletech.com/UnitPalDK/UnitPal.git --branch $branch
cd UnitPal/ansible
ansible-playbook -i inventories/$inventory/hosts --private-key=~/.ssh/unitpal_rsa -u unitpal unitpal_update.yml
cd ../../../
rm -rf $environment
echo "Finished install $environment on Azure"
