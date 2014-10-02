/*
 * Copyright (c) Codiad & Andr3as, distributed
 * as-is and without warranty under the MIT License.
 * See http://opensource.org/licenses/MIT for more information. 
 * This information must remain intact.
 */

(function(global, $){
    
    var codiad = global.codiad,
        scripts = document.getElementsByTagName('script'),
        path = scripts[scripts.length-1].src.split('?')[0],
        curpath = path.split('/').slice(0, -1).join('/')+'/';

    $(function() {
        codiad.Iconbar.init();
    });

    codiad.Iconbar = {
        
        path: curpath,
        
        init: function() {
            var _this = this;
            $('.sb-right-content hr:first').before('<div class="icon_bar"></div>');
            $('.icon_bar').html(
                '<div class="line"><span class="icon icon-ccw disabled" title="Undo"/>'+
                '<span class="icon icon-cw disabled" title="Redo"/>'+
                '<span class="icon icon-search disabled" title="Search"/>'+
                '<span class="icon icon-replace disabled" title="Search and Replace"/></div>'+
                '<div class="line"><span class="icon icon-indent disabled" title="Indent"/>'+
                '<span class="icon icon-outdent disabled" title="Outdent"/>'+
                '<span class="icon icon-gotoline disabled" title="Goto Line"/>'+
                '<span class="icon icon-download disabled" title="Download"/></div>');
            
            amplify.subscribe('active.onFocus', function(path){
                _this.activateIcons(path);
            });
            amplify.subscribe('active.onClose', function(path){
                _this.deactivateIcons(path);
            });
            $('.icon_bar .icon:not(.disabled)').live('click',function(event){
                var item = event.target;
                if ($(item).hasClass('icon-ccw')) {
                    _this.undo();
                } else if ($(item).hasClass('icon-cw')) {
                    _this.redo();
                } else if ($(item).hasClass('icon-search')) {
                    _this.search();
                } else if ($(item).hasClass('icon-indent')) {
                    _this.indent();
                } else if ($(item).hasClass('icon-outdent')) {
                    _this.outdent();
                } else if ($(item).hasClass('icon-download')) {
                    _this.download();
                } else if ($(item).hasClass('icon-gotoline')) {
                    _this.gotoLine();
                } else if ($(item).hasClass('icon-replace')) {
                    _this.replace();
                }
            });
            this.$onDocumentChange = this.onDocumentChange.bind(this);
            amplify.subscribe('active.onOpen', function(path){
                var session = codiad.editor.getActive().getSession();
                session.addEventListener('change', _this.$onDocumentChange);
            });
        },
        
        activateIcons: function(path) {
            $('.icon_bar .icon').removeClass('disabled');
            this.onDocumentChange();
        },
        
        deactivateIcons: function(path) {
            $('.icon_bar .icon').addClass('disabled');
        },
        
        onDocumentChange: function() {
            $('.icon_bar .icon-ccw').removeClass('disabled');
            $('.icon_bar .icon-cw').removeClass('disabled');
            var undoManager = codiad.editor.getActive().getSession().getUndoManager();
            if (!undoManager.hasUndo()) {
                $('.icon_bar .icon-ccw').addClass('disabled');
            }
            if (!undoManager.hasRedo()) {
                $('.icon_bar .icon-cw').addClass('disabled');
            }
        },
        
        undo: function() {
            if (codiad.editor.getActive() !== null) {
                codiad.editor.getActive().undo();
                this.onDocumentChange();
            }
        },
        
        redo: function() {
            if (codiad.editor.getActive() !== null) {
                codiad.editor.getActive().redo();
                this.onDocumentChange();
            }
        },
        
        search: function() {
            codiad.editor.openSearch('search');
        },
        
        replace: function() {
            codiad.editor.openSearch('replace');
        },
        
        indent: function() {
            if (codiad.editor.getActive() !== null) {
                codiad.editor.getActive().blockIndent();
            }
        },
        
        outdent: function() {
            if (codiad.editor.getActive() !== null) {
                codiad.editor.getActive().blockOutdent();
            }
        },
        
        download: function() {
            if (codiad.active.getPath() !== null) {
                codiad.filemanager.download(codiad.active.getPath());
            }
        },
        
        gotoLine: function() {
            if (codiad.editor.getActive() !== null) {
                var line = parseInt(prompt("Enter line number:"), 10);
                if (!isNaN(line)) {
                    codiad.editor.gotoLine(line);
                    codiad.editor.focus();
                }
            }
        }
    };
})(this, jQuery);