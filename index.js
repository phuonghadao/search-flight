$(document).ready(function() {
    $("#departure").datepicker({
        minDate: 0
    });

    $("#return").datepicker({
        minDate: 0
    });

    $('input[type="radio"]').change(function() {
        if ($(this).val() === 'One Way') {
            $('#return').prop('disabled', true).val('N/A');
        } else {
            $('#return').prop('disabled', false).val('');
        }
    });

    $('#searchButton').click(function(event) {
        const origin = $('#origin').val();
        const destination = $('#destination').val();
        const departureDate = $('#departure').val();
        const count = $('#count').val();
        event.preventDefault();

        sessionStorage.setItem('flightQuery', JSON.stringify({
            origin: origin,
            destination: destination,
            departureDate: departureDate,
            count: count
        }));
        window.location.href = 'booking.html#flights';
    });
});