

    ons.ready(function() {

        //Disable the back button, redirect to the dashboard.
        ons.disableDeviceBackButtonHandler();      
        window.document.addEventListener('backbutton', function() {
            fn.load('dashboard.html');
        }, false);

        //enable menu functionality
        let menu = new MenuController();
        menu._setMenuListeners();

         setTimeout(function() {
            let dashboard = new DashboardController();
            dashboard.setDashboardContent();
         }, 50);

    });


    class NotesController {

        saveNotes(){
            document.getElementById("notes_save-btn").addEventListener("click", function(){
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

            document.getElementById("note_view-content").innerHTML = parsedString.content;

            document.getElementById("note_view-tab-home").addEventListener("click", function(){
                fn.load('dashboard.html');
            });

            document.getElementById("note_view-tab-edit").addEventListener("click", function(){
                fn.load('edit_note.html', key);
            });

            document.getElementById("note_view-tab-delete").addEventListener("click", function(){

                let dialog = document.getElementById('my-alert-dialog');

                if (dialog) {
                    dialog.show();
                } else {
                    ons.createElement('alert-dialog.html', { append: true }).then(function(dialog) {
                        dialog.show();

                        document.getElementById("note_view-alert-dialog-cancel-btn").addEventListener("click", function(){
                            dialog.hide();
                        });

                        document.getElementById("note_view-alert-dialog-accept-btn").addEventListener("click", function(){
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

            document.getElementById("edit-note_title").value = parsedString.title;
            document.getElementById("edit-note_textarea").value = parsedString.content;

            document.getElementById("edit-note_save-btn").addEventListener("click", function(){
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
            document.getElementById("sidebar_dashboard").addEventListener("click", function(){
                fn.load('dashboard.html');
            });

            document.getElementById("sidebar_new-note").addEventListener("click", function(){
                fn.load('new_note.html');
            });

            document.getElementById("sidebar_export").addEventListener("click", function(){
                fn.load('export.html');
            });
        }
    }


    class DashboardController {

        //Will set the lists of the dashboard
        setDashboardContent(){
            var getAllLocaleStorageElements = this.allStorage();

            if(getAllLocaleStorageElements.length > 0){

                document.getElementById("dashboard_notes-text").innerHTML = "Your saved notes:";

                let notesCount = getAllLocaleStorageElements.length;
                for(let i = 0; i < notesCount; i++){

                    document.getElementById("dashboard_notes-list").innerHTML += '<ons-list-item class="dashboard_ons-item" id=' + getAllLocaleStorageElements[i].key
                        +'><span class="list-item__title">' + getAllLocaleStorageElements[i].value.title + '</span>'
                        +'<span class="list-item__subtitle">' + getAllLocaleStorageElements[i].value.content.substring(0, 25)
                        + '...' +'</span></ons-list-item>';

                    document.getElementById(getAllLocaleStorageElements[i].key).addEventListener("click", function(){
                        fn.load('note_view.html', getAllLocaleStorageElements[i].key);
                    });
                }

            }else{

                document.getElementById("dashboard_notes-text").innerHTML = "You have no notes!";

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
            document.getElementById('export_json-btn').addEventListener("click", function(){
                ons.notification.alert('Currenlty not possible :(');
            });

            document.getElementById('export_csv-btn').addEventListener("click", function(){
                ons.notification.alert('Currenlty not possible :(');
            });

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
