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