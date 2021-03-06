/*
 * File: js/app/view/ui/CommentForm.js
 *
 * This file was generated by Sencha Designer version 2.0.0.
 * http://www.sencha.com/products/designer/
 *
 * This file requires use of the Ext JS 4.0.x library, under independent license.
 * License of Sencha Designer does not include license for Ext JS 4.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('BlogApp.view.ui.CommentForm', {
    extend: 'Ext.form.Panel',

    cls: '',
    bodyCls: 'comments-form',
    bodyPadding: 10,
    frameHeader: false,
    api: '{ submit: Bancha.getStubsNamespace().Comment.submit}',

    initComponent: function() {
        var me = this;

        me.initialConfig = Ext.apply({
            api: '{ submit: Bancha.getStubsNamespace().Comment.submit}'
        }, me.initialConfig);

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'fieldset',
                    title: 'Add a comment',
                    items: [
                        {
                            xtype: 'hiddenfield',
                            name: 'article_id',
                            fieldLabel: '',
                            anchor: '100%'
                        },
                        {
                            xtype: 'textareafield',
                            name: 'comment',
                            fieldLabel: '',
                            allowBlank: false,
                            anchor: '100%'
                        },
                        {
                            xtype: 'toolbar',
                            style: 'margin-bottom: 10px;\n',
                            ui: 'footer\n',
                            items: [
                                {
                                    xtype: 'tbspacer',
                                    flex: 1
                                },
                                {
                                    xtype: 'button',
                                    cls: 'comment-submit',
                                    text: 'submit',
                                    action: 'submitComment'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});