$(document).ready(function () {
    // Init
    $('.image-section').hide();
    $('.loader').hide();
    $('#result').hide();

    // Upload Preview
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imageUpload").change(function () {
        $('.image-section').show();
        $('#btn-predict').show();
        $('#result').text('');
        $('#result').hide();
        readURL(this);
    });

    // Predict
    $('#btn-predict').click(function () {
        var form_data = new FormData($('#upload-file')[0]);

        // Show loading animation
        $(this).hide();
        $('.loader').show();

        // Make prediction by calling api /predict
        $.ajax({
            type: 'POST',
            url: '/predict',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
                // Hide loader
                $('.loader').hide();
                $('#result').fadeIn(600);

                // Correctly extract the prediction
                if (data.prediction) {
                    $('#result').text('Result: ' + data.prediction);
                } else if (data.error) {
                    $('#result').text('Error: ' + data.error);
                } else {
                    $('#result').text('Unexpected response');
                }

                console.log('Success!');
            },
            error: function (xhr, status, error) {
                $('.loader').hide();
                $('#result').fadeIn(600);
                $('#result').text('Error: ' + error);
                console.error('Error:', error);
            }
        });
    });

    // Help functionality
    window.showHelp = function () {
        alert("For any support reach out to predicthesign@gmail.com.");
        // Additional actions can be added here, like opening a chatbot or redirecting.
    };
});





// $(document).ready(function () {
//     // Init
//     $('.image-section').hide();
//     $('.loader').hide();
//     $('#result').hide();

//     // Upload Preview
//     function readURL(input) {
//         if (input.files && input.files[0]) {
//             var reader = new FileReader();
//             reader.onload = function (e) {
//                 $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
//                 $('#imagePreview').hide().fadeIn(650);
//             }
//             reader.readAsDataURL(input.files[0]);
//         }
//     }

//     // Image Upload Change Event
//     $("#imageUpload").change(function () {
//         $('.image-section').show();
//         $('#btn-predict').show();
//         $('#result').text('').hide();
//         readURL(this);
//     });

//     // Image Upload Prediction
//     $('#btn-predict').click(function () {
//         var form_data = new FormData($('#upload-file')[0]);

//         // Show loading animation
//         $(this).hide();
//         $('.loader').show();

//         // Make prediction by calling /predict for uploaded images
//         $.ajax({
//             type: 'POST',
//             url: '/predict',
//             data: form_data,
//             contentType: false,
//             cache: false,
//             processData: false,
//             async: true,
//             success: function (data) {
//                 $('.loader').hide();
//                 $('#result').fadeIn(600);

//                 if (data.prediction) {
//                     $('#result').text('Prediction: ' + data.prediction);
//                 } else if (data.error) {
//                     $('#result').text('Error: ' + data.error);
//                 } else {
//                     $('#result').text('Unexpected response');
//                 }
//                 console.log('Image Prediction Successful!');
//             },
//             error: function (xhr, status, error) {
//                 $('.loader').hide();
//                 $('#result').fadeIn(600).text('Error: ' + error);
//                 console.error('Image Prediction Error:', error);
//             }
//         });
//     });

//     // Webcam Capture Prediction
//     $('#btn-webcam-predict').click(function () {
//         // Show loading animation
//         $(this).hide();
//         $('.loader').show();

//         // Make prediction by calling /predict_webcam for webcam capture
//         $.ajax({
//             type: 'POST',
//             url: '/predict_webcam',
//             contentType: false,
//             cache: false,
//             processData: false,
//             async: true,
//             success: function (data) {
//                 $('.loader').hide();
//                 $('#result').fadeIn(600);

//                 if (data.prediction) {
//                     $('#result').text('Prediction (Webcam): ' + data.prediction);
//                 } else if (data.error) {
//                     $('#result').text('Error: ' + data.error);
//                 } else {
//                     $('#result').text('Unexpected response');
//                 }
//                 console.log('Webcam Prediction Successful!');
//             },
//             error: function (xhr, status, error) {
//                 $('.loader').hide();
//                 $('#result').fadeIn(600).text('Error: ' + error);
//                 console.error('Webcam Prediction Error:', error);
//             }
//         });
//     });
// });
