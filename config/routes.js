/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

	/***************************************************************************
	*                                                                          *
	* Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
	* etc. depending on your default view engine) your home page.              *
	*                                                                          *
	* (Alternatively, remove this and add an `index.html` file in your         *
	* `assets` directory)                                                      *
	*                                                                          *
	***************************************************************************/

	'GET /': 'AppViewsController.getExternalView',
	'GET /home': 'AppViewsController.getInternalView',

	/***************************************************************************
	*                                                                          *
	* Custom routes here...                                                    *
	*                                                                          *
	* If a request to a URL doesn't match any of the custom routes above, it   *
	* is matched against Sails route blueprints. See `config/blueprints.js`    *
	* for configuration options and examples.                                  *
	*                                                                          *
	***************************************************************************/
	'POST /api/account/signUp': 'AccountController.signUp',
	'POST /api/account/logIn': 'AccountController.logIn',
	'GET /api/account/activate': 'AccountController.activate',
	'POST /api/account/logOut': 'AccountController.logOut',
	'POST /api/account/requestResetPassword': 'AccountController.requestResetPassword',
	'POST /api/account/resetPassword': 'AccountController.resetPassword',

	'GET /api/hotel/details': 'HotelDetailsController.getDetails',
	'POST /api/hotel/updateBasicInfo': 'HotelDetailsController.updateBasicInfo',
	'POST /api/hotel/updatePaymentsAndPolicies': 'HotelDetailsController.updatePaymentsAndPolicies',
	'POST /api/hotel/updatePropertyDetails': 'HotelDetailsController.updatePropertyDetails',

	'GET /api/taxes': 'TaxesController.getTaxes',
	'POST /api/taxes/saveTaxItem': 'TaxesController.saveTaxItem',
	'POST /api/taxes/deleteTaxItem': 'TaxesController.deleteTaxItem',

    'POST /api/service/uploadImage': 'ServiceController.uploadImage',
    'GET /api/service/vatVerifier': 'ServiceController.checkVAT',

    'GET /api/settings/roomAmenities': 'SettingsController.getRoomAmenities',
    'GET /api/settings/roomAttributes': 'SettingsController.getRoomAttributes',
    'GET /api/settings/hotelAmenities': 'SettingsController.getHotelAmenities',
    'GET /api/settings/countries': 'SettingsController.getCountries',
    'GET /api/settings/currencies': 'SettingsController.getCurrencies',
    'GET /api/settings/paymentMethods': 'SettingsController.getPaymentMethods',
	'GET /api/settings/addOnProductCategories': 'SettingsController.getAddOnProductCategories',

    'POST /api/beds': 'BedsController.getBedList',
    'POST /api/beds/saveBedItem': 'BedsController.saveBedItem',
	'POST /api/beds/deleteBedItem': 'BedsController.deleteBedItem',
    'GET /api/beds/bedItem': 'BedsController.getBedById',

	'POST /api/addOnProducts': 'AddOnProductsController.getAddOnProductList',
	'POST /api/addOnProducts/count': 'AddOnProductsController.getAddOnProductListCount',
	'GET /api/addOnProducts/categoryIdList': 'AddOnProductsController.getAddOnProductCategoryIdList',
	'POST /api/addOnProducts/saveAddOnProductItem': 'AddOnProductsController.saveAddOnProductItem',
	'POST /api/addOnProducts/deleteAddOnProductItem': 'AddOnProductMsController.deleteAddOnProductItem',
	'GET /api/addOnProducts/addOnProductItem': 'AddOnProductsController.getAddOnProductById',

	'POST /api/customers': 'CustomersController.getCustomerList',
	'POST /api/customers/count': 'CustomersController.getCustomerListCount',
	'POST /api/customers/saveCustomerItem': 'CustomersController.saveCustomerItem',
	'GET /api/customers/customerItem': 'CustomersController.getCustomerById',

    'POST /api/rooms': 'RoomsController.getRoomList',
    'POST /api/rooms/count': 'RoomsController.getRoomListCount',
    'POST /api/rooms/saveRoomItem': 'RoomsController.saveRoomItem',
	'POST /api/rooms/deleteRoomItem': 'RoomsController.deleteRoomItem',
    'GET /api/rooms/roomItem': 'RoomsController.getRoomById',
    'GET /api/rooms/usedRoomCategories': 'RoomsController.getUsedRoomCategoryList',

    'POST /api/roomCategories': 'RoomCategoriesController.getRoomCategoryList',
    'POST /api/roomCategories/saveRoomCategoryItem': 'RoomCategoriesController.saveRoomCategoryItem',
	'POST /api/roomCategories/deleteRoomCategoryItem': 'RoomCategoriesController.deleteRoomCategoryItem',
    'GET /api/roomsCategories/roomCategoryItem': 'RoomCategoriesController.getRoomCategoryById',
    'POST /api/roomsCategories/stats': 'RoomCategoriesController.getRoomCategoryStatsList',

	'POST /api/priceProducts': 'PriceProductsController.getPriceProductList',
	'POST /api/priceProducts/count': 'PriceProductsController.getPriceProductListCount',
	'POST /api/priceProducts/savePriceProductItem': 'PriceProductsController.savePriceProductItem',
	'POST /api/priceProducts/archivePriceProductItem': 'PriceProductsController.archivePriceProductItem',
	'POST /api/priceProducts/deletePriceProductItem': 'PriceProductsController.deletePriceProductItem',
	'POST /api/priceProducts/draftPriceProductItem': 'PriceProductsController.draftPriceProductItem',
	'GET /api/priceProducts/priceProductItem': 'PriceProductsController.getPriceProductById',

	'POST /api/yieldManager/closePriceProducts': 'YieldManagerController.closePriceProducts',
	'POST /api/yieldManager/openPriceProducts': 'YieldManagerController.openPriceProducts',
};