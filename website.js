function check_password() 
{
    var password = document.getElementById("guest-info-password").value;
    var salt = "at4n8k$m§l!"
    var expectedHash = "0e1e09fad35750abcf31aff6e074c76ae7c58b4632a30eaa93019a8916fdac1d";
    var actualHash = CryptoJS.SHA256(password + salt).toString();
    
    if(actualHash === expectedHash)
    {
        return true;
    }
    else
    {
        alert("Falsches Kennwort");
        return false;
    }
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
        var password = document.getElementById("guest-info-password").value;
        var encrypted = "U2FsdGVkX191CwijcwrkpkzzwT+yB2ccAM8HdWbz5GcJeSK5huD21DnO5JQ4JhtYOxAlopSUqB7NWXIMcJ9A3Q==";
        var decrypted = CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8);
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
    if(check_details() && check_password())
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
    if(check_details() && check_password())
    {
        var family = document.getElementById("guest-info-family").value;
    
        var text = "Wir können leider nicht zu eurer Hochzeit kommen.\n\n";
        text += "Wer sind wir: " + family + "\n";
    
        var mailto = "mailto:" + get_address() + "?subject=" + "Hochzeit" + "&body=" + encodeURI(text);
        console.log(mailto);
        window.location.href = mailto;
    }
}

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

        document.getElementById("countdown-timer").innerHTML = 
            "Noch " +
            days + " Tage - " + 
            hours + " Stunden - " + 
            minutes + " Minuten " +
            seconds + " Sekunden";
    }
}, 1000);