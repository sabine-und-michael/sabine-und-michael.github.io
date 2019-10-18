function on_page_loaded()
{
    var cookie = document.cookie;
    console.log("get cookie: " + cookie);

    if(is_password_correct(cookie))
    {
        document.getElementById("page-password").value = cookie;
        try_open_page();
    }
}

function get_page_password()
{
    return document.getElementById("page-password").value;
}

function is_password_correct(password)
{
    var salt = "at4n8k$m§l!"
    var expectedHash = "0e1e09fad35750abcf31aff6e074c76ae7c58b4632a30eaa93019a8916fdac1d";
    var actualHash = CryptoJS.SHA256(password + salt).toString();
    
    return actualHash === expectedHash;
}

function check_password() 
{
    var password = get_page_password();
    
    if(is_password_correct(password))
    {
        return true;
    }
    else
    {
        alert("Falsches Kennwort");
        return false;
    }
}

function decrypt_content(password, content)
{
    return CryptoJS.AES.decrypt(content, password).toString(CryptoJS.enc.Utf8);
}

function try_open_page()
{
    if(check_password())
    {
        var password = get_page_password();
        var content = get_content();
        var decrypted = decrypt_content(password, content);
        document.getElementById("main").innerHTML = decrypted;

        set_password_cookie(password);
    }
}

function set_password_cookie(password)
{
    var date = new Date();
    date.setTime(date.getTime() + (366 * 24 * 60 * 60 * 1000));
    var expires = ";expires="+ date.toUTCString();
    var cookie = password + expires; 
    console.log("set cookie: " + cookie);
    document.cookie = cookie;
}

function remove_cookie()
{
    var date = new Date();
    date.setTime(date.getTime() - 1);
    var cookie = ";expires="+ date.toUTCString();
    document.cookie = cookie;
}

function check_details()
{
    var family = document.getElementById("guest-info-family").value;
    if(!family || family.trim().length === 0)
    {
        console.log("family name is empty");
        return false;
    }

    var personCounts = ["guest-info-adults", "guest-info-children", "guest-info-babies"];
    try
    {
        for (index = 0; index < personCounts.length; index++) 
        {
            var valueAsString = document.getElementById(personCounts[index]).value;
            if((valueAsString.trim().length === 0) || 
               (!Number.isInteger(Number(valueAsString))) || 
               (parseInt(valueAsString, 10) < 0))
            {
                console.log("invalid number in field " + personCounts[index] + ": " + valueAsString);
                return false;
            }
        }
    }
    catch(err)
    {
        console.log(err);
        return false;
    }

    return true;
}

function get_address()
{
    try
    {
        var password = document.cookie;
        var encrypted = "U2FsdGVkX191CwijcwrkpkzzwT+yB2ccAM8HdWbz5GcJeSK5huD21DnO5JQ4JhtYOxAlopSUqB7NWXIMcJ9A3Q==";

        var decrypted = decrypt_content(password, encrypted);
        return decrypted.substring(0, decrypted.length - 10);
    }
    catch(err)
    {
        alert("Konnte Ziel EMail-Adresse nicht bestimmen");
        console.log(err);
        return "";
    }
}

function submit_guest_info() 
{
    if(check_details())
    {
        var family   = document.getElementById("guest-info-family").value;
        var adults   = document.getElementById("guest-info-adults").value;
        var children = document.getElementById("guest-info-children").value;
        var babies   = document.getElementById("guest-info-babies").value;
    
        var text = "Anmeldung zu eurer Hochzeit\n\n";
        text += "Wer sind wir: " + family + "\n";
        text += adults   + " Erwachsene\n";
        text += children + " Kinder\n";
        text += babies   + " Kleinkinder\n";
    
        var mailto = "mailto:" + get_address() + "?subject=" + "Hochzeit" + "&body=" + encodeURI(text);
        console.log(mailto);
        window.location.href = mailto;
    }
}

function decline()
{
    if(check_details())
    {
        var family = document.getElementById("guest-info-family").value;
    
        var text = "Wir können leider nicht zu eurer Hochzeit kommen.\n\n";
        text += "Wer sind wir: " + family + "\n";
    
        var mailto = "mailto:" + get_address() + "?subject=" + "Hochzeit" + "&body=" + encodeURI(text);
        console.log(mailto);
        window.location.href = mailto;
    }
}

function on_page_decrypted()
{
    var x = setInterval(function() 
    {
        var countDownDate = new Date(2020, 5, 6, 13, 0).getTime();

        var now = new Date().getTime();
        var distance = countDownDate - now;

        if (distance < 0) 
        {
            clearInterval(x);
            document.getElementById("countdown-timer").innerHTML = "";
        }
        else
        {
            var days    = Math.floor( distance / (1000 * 60 * 60 * 24));
            var hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            var day_text    = days    === 1 ? "Tag"     : "Tage";
            var hour_text   = hours   === 1 ? "Stunde"  : "Stunden";
            var minute_text = minutes === 1 ? "Minute"  : "Minuten";
            var second_text = seconds === 1 ? "Sekunde" : "Sekunden";

            document.getElementById("countdown-timer").innerHTML = 
                "Noch " +
                days    + "&nbsp;" + day_text    + ", " +
                hours   + "&nbsp;" + hour_text   + ", " +
                minutes + "&nbsp;" + minute_text + ", " +
                seconds + "&nbsp;" + second_text ;
        }
    }, 1000);
}

function get_content()
{
    return "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";
}