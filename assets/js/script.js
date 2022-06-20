var dartLeft = Array(26).fill(0);
var dartRight = Array(26).fill(0);
var scoreLeft = 0;
var scoreRight = 0;
var dartNum;
// defaults
var addSub = 1; // 0 is sub 1 is add

$('button').click(function(event) {
    //get id
    var idClicked = event.target.id;

    switch (idClicked) {
        case 'help':
            help();
            break;
        case 'refresh':
            location.reload();
            break;
        case 'addsub':
            if (addSub === 1) {
                addSub = 0;
                $('#addsub').css('background-color', 'red');
                $('#addsub').removeClass('fa-solid fa-plus');
                $('#addsub').addClass('fa-solid fa-minus');
            } else {
                addSub = 1;
                $('#addsub').css('background-color', 'green');
                $('#addsub').addClass('fa-solid fa-plus');
            }
            break;
        default:
            //separate letter and number from idClicked
            player = idClicked.replace(/[0-9]/g, '');
            dartNum = idClicked.replace(/\D/g, '');
            if (addSub === 1) {
                addEm(player, dartNum);
            } else if (addSub === 0) {
                subEm(player, dartNum);
            }
    }
}); //on 'button' click function

var addEm = function(player, dartNum) {
    // need to convert dartnum to INT since it was obtained from string
    dartNum = parseInt(dartNum);
    // player 1 left
    if (player === 'l') {
        // if all 3 darts haven't been hit keep couting darts
        if (dartLeft[dartNum] < 3) {
            if (dartLeft[dartNum] === 0) {
                $('#' + player + 'd' + dartNum)
                    .addClass('fa-solid fa-slash fa-3x')
                    .text('');
            } else if (dartLeft[dartNum] === 1) {
                $('#' + player + 'd' + dartNum)
                    .removeClass('fa-solid fa-slash')
                    .addClass('fa-solid fa-xmark fa-3x');
            } else if (dartLeft[dartNum] === 2) {
                $('#' + player + 'd' + dartNum)
                    .removeClass('fa-solid fa-xmark')
                    .addClass('fa-solid fa-circle-radiation fa-3x');
            }
            dartLeft[dartNum]++;
        }
        // if 3 darts have been counted time to score
        else {
            scoreLeft = scoreLeft + dartNum;
            dartLeft[dartNum]++;
            $('#lScore').text(scoreLeft);
        }
    } //end player 1
    //player 2 (right)
    else if (player === 'r') {
        // if all 3 darts haven't been hit keep couting darts
        if (dartRight[dartNum] < 3) {
            if (dartRight[dartNum] === 0) {
                $('#' + player + 'd' + dartNum)
                    .addClass('fa-solid fa-slash fa-3x')
                    .text('');
            } else if (dartRight[dartNum] === 1) {
                $('#' + player + 'd' + dartNum)
                    .removeClass('fa-solid fa-slash')
                    .addClass('fa-solid fa-xmark fa-3x');
            } else if (dartRight[dartNum] === 2) {
                $('#' + player + 'd' + dartNum)
                    .removeClass('fa-solid fa-xmark')
                    .addClass('fa-solid fa-circle-radiation fa-3x');
            }
            dartRight[dartNum]++;
        }
        // if 3 darts have been counted time to score
        else {
            scoreRight = scoreRight + dartNum;
            dartRight[dartNum]++;
            $('#rScore').text(scoreRight);
        }
    } //end player 2
}; //end addem

// subtract section - allows you to deduct points and darts
var subEm = function(player, dartNum) {
    dartNum = parseInt(dartNum);
    if (player === 'l') {
        if (dartLeft[dartNum] === 1) {
            $('#' + player + 'd' + dartNum)
                .removeClass('fa-solid fa-slash fa-3x')
                .text('Darts');
            dartLeft[dartNum]--;
        } else if (dartLeft[dartNum] === 3) {
            $('#' + player + 'd' + dartNum)
                .removeClass('fa-solid fa-circle-radiation')
                .addClass('fa-solid fa-xmark');
            dartLeft[dartNum]--;
        } else if (dartLeft[dartNum] === 2) {
            $('#' + player + 'd' + dartNum)
                .removeClass('fa-solid fa-xmark')
                .addClass('fa-solid fa-slash');
            dartLeft[dartNum]--;
        } else if (dartLeft[dartNum] > 3) {
            scoreLeft = scoreLeft - dartNum;
            dartLeft[dartNum]--;
            $('#lScore').text(scoreLeft);
        }
    } // end player 1
    else if (player === 'r') {
        if (dartRight[dartNum] === 1) {
            $('#' + player + 'd' + dartNum)
                .removeClass('fa-solid fa-slash fa-3x')
                .text('Darts');
            dartRight[dartNum]--;
        } else if (dartRight[dartNum] === 3) {
            $('#' + player + 'd' + dartNum)
                .removeClass('fa-solid fa-circle-radiation')
                .addClass('fa-solid fa-xmark');
            dartRight[dartNum]--;
        } else if (dartRight[dartNum] === 2) {
            $('#' + player + 'd' + dartNum)
                .removeClass('fa-solid fa-xmark')
                .addClass('fa-solid fa-slash');
            dartRight[dartNum]--;
        } else if (dartRight[dartNum] > 3) {
            scoreRight = scoreRight - dartNum;
            dartRight[dartNum]--;
            $('#rScore').text(scoreRight);
        }
    } //end player 2
}; //end subem

var help = function() {
    const helpMsg =
        'Use the + button to toggle between add / subtract.\n' +
        'It applies to darts and points.\n\n' +
        'The green numbers add darts or points.\n\n' +
        'The yellow refresh button starts a new game.\n\n' +
        'The blue circle with a question mark loads this help screen.\n';
    swal({
        title: 'Help',
        text: helpMsg,
        button: 'Close',
    });
    return;
};

// chromecast implmentation attempt

window.__onGCastApiAvailable = function(isAvailable) {
    if (!isAvailable) {
        return false;
    }

    var castContext = cast.framework.CastContext.getInstance();

    castContext.setOptions({
        autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
        receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    });

    var stateChanged = cast.framework.CastContextEventType.CAST_STATE_CHANGED;
    castContext.addEventListener(stateChanged, function(event) {
        var castSession = castContext.getCurrentSession();
        var media = new chrome.cast.media.MediaInfo('https://www.example.com/my-song.mp3', 'audio/mp3');
        var request = new chrome.cast.media.LoadRequest(media);

        castSession && castSession
            .loadMedia(request)
            .then(function() {
                console.log('Success');
            })
            .catch(function(error) {
                console.log('Error: ' + error);
            });
    });
};