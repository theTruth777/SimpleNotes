

    ons.ready(function() {

        //enable menu functioanlity
        let menu = new MenuController();
        menu._setMenuListeners();

         setTimeout(function() {
            let dashboard = new DashboardController();
            dashboard.setDashboardContent();
         }, 50);

    });


    class NotesController {

        saveNotes(){
            $( "#notes_save-btn" ).click(function() {
                let userNote = document.getElementById('newUserNote').value;
                let userNoteTitle = document.getElementById('newUserNoteTitle').value;

                if((userNote === '') ||(userNoteTitle === '')) {
                    ons.notification.alert('Your note is empty!');
                    return;
                }
                
                let localstorageValue = {'title': userNoteTitle, 'content': userNote, 'timestamp': new Date().getTime()};
                localStorage.setItem('A' + new Date().getTime(), JSON.stringify(localstorageValue));

                fn.load('dashboard.html');
            });
        }

        getNoteContent(key){
            let storageItem = localStorage.getItem(key);
            let parsedString = JSON.parse(storageItem);

            var that = this;

            $('#note_view-content').html(parsedString.content);

            $("#note_view-tab-home").click(function() {
                fn.load('dashboard.html');
            });

            $("#note_view-tab-edit").click(function() {
                fn.load('edit_note.html', key);
            });

            $("#note_view-tab-delete").click(function() {

                let dialog = document.getElementById('my-alert-dialog');

                if (dialog) {
                    dialog.show();
                } else {
                    ons.createElement('alert-dialog.html', { append: true }).then(function(dialog) {
                        dialog.show();

                        $("#note_view-alert-dialog-cancel-btn").click(function() {
                            dialog.hide();
                        });

                        $("#note_view-alert-dialog-accept-btn").click(function() {
                            that.deleteNote(key);
                            dialog.hide();
                        });

                    });
                }

            });

        }


        editNote(key){
            let storageItem = localStorage.getItem(key);
            let parsedString = JSON.parse(storageItem);

            $('#edit-note_title').val(parsedString.title);
            $('#edit-note_textarea').val(parsedString.content);

            $("#edit-note_save-btn").click(function() {

                let userNoteTitle = document.getElementById('edit-note_title').value;
                let userNote = document.getElementById('edit-note_textarea').value;

                let localstorageValue = {'title': userNoteTitle, 'content': userNote, 'timestamp': parsedString.content.timestamp};
                localStorage.setItem(key, JSON.stringify(localstorageValue));

                fn.load('dashboard.html');
            });

        }



        deleteNote(key){
            localStorage.removeItem(key);
            fn.load('dashboard.html');
        }
    }


    class MenuController {

        _setMenuListeners(){
            $("#sidebar_dashboard").click(function() {
                fn.load('dashboard.html');
            });

            $("#sidebar_new-note").click(function() {
                fn.load('new_note.html');
            });

            $("#sidebar_export").click(function() {
                fn.load('export.html');
            });
        }
    }


    class DashboardController {

        //Will set the lists of the dashboard
        setDashboardContent(){
            var getAllLocaleStorageElements = this.allStorage();

            if(getAllLocaleStorageElements.length > 0){
                $('#dashboard_notes-text').html("Your saved notes:");

                let notesCount = getAllLocaleStorageElements.length;
                for(let i = 0; i < notesCount; i++){
                    $('#dashboard_notes-list').append(
                        '<ons-list-item class="dashboard_ons-item" id=' +  getAllLocaleStorageElements[i].key 
                        +'><span class="list-item__title">' + getAllLocaleStorageElements[i].value.title + '</span>' 
                        +'<span class="list-item__subtitle">' + getAllLocaleStorageElements[i].value.content.substring(0, 25) + '...' +'</span></ons-list-item>'
                        );
                 
                    $('#' + getAllLocaleStorageElements[i].key).click(function() {
                        fn.load('note_view.html', getAllLocaleStorageElements[i].key);
                    });
                }

            }else{

                $('#dashboard_notes-text').html("You have no notes!");

            }
        }

        //reads entire local storage and returns it as an array
        allStorage() {
            let values = [],
                keys = Object.keys(localStorage),
                i = keys.length;

            while ( i-- ) {
                values.push({key: keys[i], value: JSON.parse(localStorage.getItem(keys[i]))})
            }

            return values;
        }

    }


    class ExportController {

        setEventListener(){
            var that = this;
            $("#export_json-btn").click(function() {
                alert(9);
            });

            $("#export_csv-btn").click(function() {
                that.exportCsv();
            });

        }

        exportCsv(){
            let dashboard = new DashboardController();
            let getItems = dashboard.allStorage();

            let exportString = '';

            for(let i = 0; i < getItems.length; i++){
                exportString = exportString + getItems[i].value + ','
            }
            
            let encodedUri = encodeURI(exportString);
            window.open(encodedUri);
        }
    }


    window.fn = {};
    window.fn.open = function() {
    var menu = document.getElementById('menu');
        menu.open();
    };

    window.fn.load = function(page, key = null) {
        var content = document.getElementById('content');
        var menu = document.getElementById('menu');
        content.load(page)
            .then(menu.close.bind(menu));

         setTimeout(function() {
            if(page === 'dashboard.html'){
                let dashboard = new DashboardController();
                dashboard.setDashboardContent();
            }

            if(page === 'new_note.html'){
                let notes = new NotesController();
                notes.saveNotes();
            }

            if(page === 'note_view.html'){
                let notes = new NotesController();
                notes.getNoteContent(key);
            }

            if(page === 'export.html'){
                let exportController = new ExportController();
                exportController.setEventListener();
            }

            if(page === 'edit_note.html'){
                let notes = new NotesController();
                notes.editNote(key);
            }
            
         }, 50);

    };
