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
        const returnDate = $('#return').val();
        const flightType = $('input[name="trip-type"]:checked').val();
        const count = $('#count').val();
        event.preventDefault();

        if (!flightType) {
            alert('Please select a flight type.');
        } else if (!origin || !destination) {
            alert('Please fill in both departure city and destination.');
        } else if (!departureDate) {
            alert('Please select a departure date.');
        } else if (flightType === 'Round Trip' && !returnDate) {
            alert('Please select a return date.');
        } else {
            if (flightType === 'One Way') {
                sessionStorage.setItem('flightQuery', JSON.stringify({
                    origin: origin,
                    destination: destination,
                    departureDate: departureDate,
                    count: count,
                    flightType: flightType
                }));
                window.location.href = 'booking.html#flights';
            } else if (flightType === 'Round Trip') {
                sessionStorage.setItem('flightQuery', JSON.stringify({
                    origin: origin,
                    destination: destination,
                    departureDate: departureDate,
                    returnDate: returnDate,
                    count: count,
                    flightType: flightType
                }));
                window.location.href = 'booking.html#flights';
            }
        }
    });
});