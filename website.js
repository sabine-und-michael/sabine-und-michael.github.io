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

function decrypt_content(password, content)
{
    return CryptoJS.AES.decrypt(content, password).toString(CryptoJS.enc.Utf8);
}

function try_open_page()
{
    var password = get_page_password();
    if(!password)
    {
        return;
    }

    var wrongPasswordText = "";
    if(is_password_correct(password))
    {
        var content = get_content();
        var decrypted = decrypt_content(password, content);
        document.getElementById("main").innerHTML = decrypted;

        set_password_cookie(password);
    }
    else
    {
        wrongPasswordText = "<br>Falsches Passwort";
    }
    document.getElementById("wrong-password-info").innerHTML = wrongPasswordText;
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

function check_person_count()
{
    var personCounts  = ["guest-info-adults", "guest-info-children", "guest-info-babies"];
    var personMinimum = [1,                   0,                     0                  ];
    try
    {
        for (index = 0; index < personCounts.length; index++) 
        {
            var valueAsString = document.getElementById(personCounts[index]).value;
            if((valueAsString.trim().length === 0) || 
               (!Number.isInteger(Number(valueAsString))) || 
               (parseInt(valueAsString, 10) < personMinimum[index]))
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

function check_family_name()
{
    var family = document.getElementById("guest-info-family").value;
    
    return (family && !(family.trim().length === 0))
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
    if(check_family_name() && check_person_count())
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
    if(check_family_name())
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