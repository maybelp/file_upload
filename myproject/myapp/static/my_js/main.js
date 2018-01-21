function getCookie(name) {
    // Method to get round Djangos CSRF token authentication
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}


function send_files($, files){
    // takes in the $ jquery module pointer as first argument
    // and a list of files as seconds and sends them to django server
    // who stores them in server and registers in database
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    var data = new FormData();
    for (var i=0, file; file=files[i]; i++) {
        data.append('docfile', file);
    }
    $.ajax({
        // xhr: idea taken from stack overflow to track the progress of upload
        xhr: function() {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function(evt) {
              //console.log(evt.lengthComputable);
              if (evt.lengthComputable) {
                var percentComplete = evt.loaded / evt.total;
                percentComplete = parseInt(percentComplete * 100);
                //console.log(percentComplete);
                move_bar(percentComplete);
                if (percentComplete === 100) {
                    window.location.href = "thanks" ;
                }

              }
            }, false);

            return xhr;
        },
        url : "/myapp/main/",
        processData : false,
        contentType : false,
        type : 'POST',
        data : data,
    }).done(function(data) {
        // work with data 
        window.location.href = "thanks";
    });
}


function files_string(){
    // This function  builds a string of at most 3 files
    // that are queued up to be uploaded
    files = document.getElementById("id_docfile").files;
    out_str = "";
    for (var i=0, file; file=files[i]; i++) {
        if (i > 3){
            out_str += ", ...";
            break;
        }
        out_str += file.name + ", ";
    } 
    document.getElementById("texto").innerHTML = out_str;
}


function move_bar(width) {
    // Moves progress bar
    var elem = document.getElementById("myBar"); 
    if (width >= 100) {
        
    } else {
        elem.style.width = width + '%'; 
    }
}


function up($){
    files = document.getElementById("id_docfile").files;
    if( files.length == 0 ){
        alert("Please select files first, or use drag and drop");
    }else{
        send_files($, files)
    }
}
