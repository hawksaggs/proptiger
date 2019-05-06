$(document).ready(function () {
    if (typeof(Storage) !== "undefined") {
        // Code for localStorage
        renderLocalStorage();
    } else {
        // No web storage Support.
        console.log('No web storage support');
    }

    $(".nav-tabs").on("click", "a", function (e) {
        e.preventDefault();
        if (!$(this).hasClass('add-contact')) {
            $(this).tab('show');
        }
    })
        .on("click", "span", function () {
            var anchor = $(this).siblings('a');
            $(anchor.attr('href')).remove();
            $(this).parent().remove();
            $(".nav-tabs li").children('a').first().click();
        });

    $('#runQuery').click(function (e) {
        e.preventDefault();
        var textarea;
        textarea = showSelection();

        console.log('Run query');

        if (!textarea.length) {
            // alert('You have not selected any query');
            textarea = $('#textarea').val();
        }

        var queries = textarea.trim().split("\n");

        queries.forEach(query => {
            query = query.trim();
            // console.log(query);
            if (query.length > 0) {
                $.ajax({
                    method: 'POST',
                    url: 'http://localhost:3000/execute',
                    data: { query: query.trim() },
                    success: function (data) {
                        // console.log(data);
                        // console.log(data.data);
                        var id = $(".nav-tabs").children().length;
                        var tabId = 'contact_' + id;
                        $(".nav-tabs").append('<li><a href="#contact_' + id + '">Result</a> <span> x </span></li>');
                        var table = ``;
                        if (data.data.length > 0) {
                            table += `<table class="table table-hover">    
                                        <thead>
                                        <tr>`;
                            const header = data.data[0];
                            Object.keys(header).forEach(function (h) {
                                table += `<th>${h}</th>`;
                            });
                            table += `</tr></thead><tbody>`;
                            data.data.forEach(function (d) {
                                table += `<tr>`;
                                Object.values(d).forEach(function (r) {
                                    table += `<td>${r}</td>`;
                                });
                                table += `</tr>`;
                            });
                            table += `</tbody>`;
                            table += `</table>`
                        }
                        table += `</div>`

                        $('.tab-content').append('<div class="tab-pane" id="' + tabId + '">' + table + '</div>');
                        $('.nav-tabs li:nth-child(' + id + ') a').click();

                        clearSelection();
                    },
                    error: function(err) {
                        console.log(err);
                        alert(err.responseJSON.message);
                    }
                })
            }

        });
    });

    $('#add').click(function(e){
        e.preventDefault();
        var name = $('#queryName').val();
        if(!name || name.length == 0) {
            alert('Please give name to workspace');
            return;
        }
        var selection = showSelection();
        if (!selection.length) {
            // alert('You have not selected any query');
            selection = $('#textarea').val();
        }
        var queries = window.localStorage.getItem('queries');
        if(queries) {
            queries = JSON.parse(queries);
        } else {
            queries = {};
        }
        queries[name] = selection;
        window.localStorage.setItem('queries', JSON.stringify(queries));
        renderLocalStorage();
    });

    $(".close").click(function(e){
        e.preventDefault();
        var queries = window.localStorage.getItem('queries');
        queries = JSON.parse(queries);
        delete queries[$(this).attr('data-key')];
        window.localStorage.setItem('queries', JSON.stringify(queries));
        $(this).parent().remove();
    });

    $(".store").click(function(e){
        console.log('store');
        e.preventDefault();
        var queries = window.localStorage.getItem('queries');
        queries = JSON.parse(queries);
        $('#textarea').val(queries[$(this).children("span").attr('data-key')]);
    });

    function showSelection() {
        var textComponent = document.getElementById('textarea');
        var selectedText;

        if (textComponent.selectionStart !== undefined) {// Standards Compliant Version
            var startPos = textComponent.selectionStart;
            var endPos = textComponent.selectionEnd;
            selectedText = textComponent.value.substring(startPos, endPos);
        } else if (document.selection !== undefined) { // IE Version
            textComponent.focus();
            var sel = document.selection.createRange();
            selectedText = sel.text;
        }

        return selectedText;
    }

    function hashCode(s) {
        return s.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    }

    function clearSelection() {
        if (window.getSelection) { window.getSelection().removeAllRanges(); }
        else if (document.selection) { document.selection.empty(); }
    }

    function renderLocalStorage() {
        var queries = window.localStorage.getItem('queries');
        console.log(queries);
        if(queries) {
            queries = JSON.parse(queries);
            console.log(queries);
            $('.savedQueries').children().remove();
            Object.keys(queries).forEach(q => {
                $('.savedQueries').append(`<li class="store">${q}<span class="close" data-key="${q}">&times;</span></li>`);
            });
        }
    }

});