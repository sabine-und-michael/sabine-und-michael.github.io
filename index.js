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
