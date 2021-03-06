
/*
 * Yes, this is a bit ugly, but there is no elegenat solution for this.
 * Ext Designer is still strugling with how to enable custom programming and
 * currently neighter the old, nor the new way is working, see 
 * http://www.sencha.com/forum/showthread.php?184095-Breaking-changes-regarding-Code-Editing-Build-gt-298
 * 
 * So this is the only reliable way of writting custom code.
 */


/*
 * override Store models
 * (in the future just one line of code in the init solves this, but this Designer feature is not working yet)
 */

var overrideStoreConstructor = function(modelName) {
    Ext.define('BlogApp.store.override.'+modelName+'s', {
        override: 'BlogApp.store.'+modelName+'s',
        
        // standard ext designer code
        constructor: function(cfg) {
            var me = this;
            cfg = cfg || {};
            me.callParent([Ext.apply({
                model: Bancha.getModel(modelName) // this line is new
            }, cfg)]);
        }
    });
}; // eo overrideStoreConstructor

// apply
overrideStoreConstructor('User');
overrideStoreConstructor('Article');
overrideStoreConstructor('Comment');



/*
 * override the template, since designer doesn't allow member functions (missing feature)
 */
Ext.define('BlogApp.view.override.CommentsList', {
     override: 'BlogApp.view.CommentsList',

     initComponent: function() {
         var me = this;

         // overwrite template
         this.tpl = new Ext.XTemplate(
             '<tpl for="."><div class="comment">{comment}<span class="comment-meta">{[this.getAuthorName(values.user_id)]}{[this.getDate(values.created)]}</span></div></tpl>',
             {
                 getAuthorName: function(id) {
                 	// get the users store
                 	var store = Ext.StoreMgr.get('Users');

                 	// if the record doesn't exists
                 	if(!store || !store.getById(id)) {
                     	return 'undefined';
                 	}

                 	// return the author's name
                 	return store.getById(id).get('name');
                 },
                 /**
                  * necessary since I don't want to provide an date for unsaved comments
                  */
                 getDate: function(date) {
                     if(date) {
                         return ', '+Ext.Date.format(date, "Y-m-d");
                     }
                     return '';
                 }
             }
         );
         me.callParent(arguments);
     }
});


/*
 * Ext Designer Bug fix
 * change the form panel api string to an object
 * For why see: http://www.sencha.com/forum/showthread.php?184414-Ext.form.Panel-doesn-t-allow-to-defined-a-api-object&p=745773
 */
var className = 'BlogApp.view.ui.CommentForm';
Ext.require([className], function() {
    var classObj = Ext.ClassManager.get(className),
    	classPrototype = classObj.prototype,
    	fixApiConfig = function(api) {
			if(Ext.isString(api)) {
				var stringToObject = new Function("return "+api);
				return stringToObject();
			} else {
				return api;
			}
		};

	// Ext Designer defines the api two times, so we need to 
	// overwrite two times as well
    Ext.define(className+'Overrride', {
         override: className,
         
         // override the designer config
         api: fixApiConfig(classPrototype.api),
         
         // override the designer initComponent config
         constructor : function(config) {
             if(!config.api) {
                 config.api = fixApiConfig(classPrototype.api);
             }
             this.callParent([config]);
         }
    });
});

// eof