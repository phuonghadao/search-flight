const options = { //SET VALUE FOR THE DATE
    year: 'numeric', 
    month: 'short', 
    day: '2-digit', 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
};

$(document).ready(function() { // CLICK LOGO TO GO THE HOMEPAGE
    $('.logo').click(function() {
        window.location.href = 'index.html';
    });

    const tabs = $(".tab");
    const tabContents = $(".tab-content");

    tabs.click(function() {
        const tabName = $(this).data("tab");
        showTab(tabName);
        tabs.removeClass("active");
        $(this).addClass("active");
        history.pushState(null, null, `#${tabName}`);
    });

    $(window).on("popstate", function(event) {
        const tabName = location.hash.slice(1);
        showTab(tabName);
    });

    function showTab(tabName) {
        tabContents.each(function() {
            if (this.id === tabName) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    if(window.location.hash === '#passengers'){
        $('#passengers').addClass("active");
    }

    // TAB DISPLAY BASED ON HASH
    const initialTab = location.hash.slice(1);
    showTab(initialTab);

    //SEARCH FLIGHT
    const flightQueryJson = sessionStorage.getItem('flightQuery');
    if(flightQueryJson) {
        const flightData = JSON.parse(flightQueryJson);
        const origin = capitalize(flightData.origin);
        const destination = capitalize(flightData.destination);
        const departureDate = new Date(flightData.departureDate);
        $('#flight-heading').html(` ${origin} <i class="ri-flight-takeoff-line"></i> ${destination}`);

        fetchFlightData(origin, destination).then(function(flights){
            if(flights.length == 0){
                const text = `<div class="no-flight-message">
                                <h1>No available flights between ${origin} and ${destination}</h1>
                            </div>`
                $('body').append(text);
            } else{
                flights.forEach(flight => {
                    const departureTime =  flight.departureTime; 
                    const [timeStr, ampm] = departureTime.split(" ");
                    const [hoursStr, minutesStr] = timeStr.split(":");
    
                    let hours = parseInt(hoursStr, 10);
                    const minutes = parseInt(minutesStr, 10);
                    if (ampm.toLowerCase() === "pm" && hours < 12) {
                        hours += 12;
                    }
    
                    departureDate.setHours(hours);
                    departureDate.setMinutes(minutes);
        
                    const duration = flight.duration; //CALCULATE ARRIVAL DATE BASED ON DEPARTURE DATE
                    const arrivalDate = new Date(departureDate.getTime() + duration * 60 * 60 * 1000).toLocaleString('en-US',options);
                    //DISPLAY THE SEARCH FLIGHT
                    const text = `<div class="flight-details-container"> 
                                    <div class="flight-details">
                                        <div class="flight-details-row">
                                            <div class="detail row1">
                                                ${origin}
                                            </div>
                                            <div class="detail row1">
                                                ------<span>&#9992;</span>------   
                                            </div>
                                            <div class="detail row1">
                                                ${destination}
                                            </div>
                                            <div class="detail row1">
                                                
                                            </div>
                                            <div class="detail row1 buttonCell">
                                                <button class="btn selectButtons" id="selectBtn">${flight.price} AUD</button>
                                            </div>
                                        </div>
                                        <div class="flight-details-row">
                                            <div class="detail row2">
                                                ${departureDate.toLocaleString('en-US',options)}
                                            </div>
                                            <div class="detail row2">
                                                
                                            </div>
                                            <div class="detail row2">
                                                ${arrivalDate}
                                            </div>
                                            <div class="detail row2">
                                                ${flight.flightNo?flight.flightNo:"Flight Number N/A"}
                                            </div>
                                            <div class="detail row2">   
                                            </div>
                                        </div>
                                    </div>
                                </div>`
                    $('#flights').append(text);
                });
    
                $('#flights').append(`<div class="proceed-btn-container">
                                    <button class="btn" id="proceedBtn">PROCEED</button>
                                 </div>`)
                
                $('#flights').append(footerText);
                $('.selectButtons').click(function() {
                    $('.flight-details-container').removeClass('selected');
                    var container = $(this).closest('.flight-details-container');
                    container.addClass('selected');
                });
    
                $('#proceedBtn').click(function(){
                    var selectedFlight = $('.flight-details-container.selected');
                    if (selectedFlight.length > 0) {
                        // Retrieve flight data from the selected flight details container
                        var flightData = {
                            origin: capitalize(selectedFlight.find('.row1:eq(0)').text().trim()),
                            destination: capitalize(selectedFlight.find('.row1:eq(2)').text().trim()),
                            departure: selectedFlight.find('.row2:eq(0)').text().trim(),
                            arrival: selectedFlight.find('.row2:eq(2)').text().trim(),
                            price: selectedFlight.find('.row1:eq(3)').text().trim(),
                            flightNo: selectedFlight.find('.row2:eq(3)').text().trim()
                        };

                        window.location.hash = "passengers";
                        tabs.removeClass("active");
                        $(".booking-nav span[data-tab='passengers']").addClass("active");
                        // // Store flight data in session storage
                        sessionStorage.setItem('selectedFlight', JSON.stringify(flightData));
                    } else{
                        alert("Please select a flight.");
                    }
            });
            };
        })     
    }; 
});

const footerText = ` <footer class="footer">
                        <div class="footer-top">
                            <p>FlyDreamAir</p>
                        </div>
                    </footer>`;

function fetchFlightData(origin, destination) {
    return fetch('flights_info.json') // RETRIEVE DATA FROM JSON
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data['flights'].filter(flight => flight.departureCity === origin && flight.destinationCity === destination);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });     
}

function capitalize(string) {
    return string.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}