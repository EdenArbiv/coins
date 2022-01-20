$(() => {
  let arr = [];
 
  $.get(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&page=1&per_page=100",
    function (coins) {
      console.log(coins)
      for (const coin of coins) {
     
        
        arr.push(coin);
        function drawcd(coin) {
          $(".loader").hide();
          $(".coins").append(
            `
          <div class="row" >
          <div class="col-sm-6">
              <div class="card" style="width:280px; height:auto;">
                  <div class="card-body">
                      <h5 class="card-title">${coin.name}</h5>
                      <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" role="switch" id="${coin.id}">
                      <label class="form-check-label" for="${coin.id}"></label>
                      </div>
                      <p class="card-text">${coin.id}</p>
                      <button id="${coin.id}" type="button" class="btn btn-primary" >More Info</button>
                      <br><br>
                      <div id="${coin.id}" class="in"></div>
                  </div>
              </div>
            </div>
            </div>
        `
          );

          $(`.btn#${coin.id}`).click(function getdata() {
            $(".loader").show();
            let time = Date.now()
           
            if (!localStorage.getItem(coin.id)) {
         
              if($(`#${coin.id}.in`).text() == "" || $(`#${coin.id}.in`).is(":hidden")) {
                
              $.get(`https://api.coingecko.com/api/v3/coins/${this.id}`,function (data) {

                  const details = {
                    img: data.image.small,
                    usd: data.market_data.current_price.usd,
                    eur: data.market_data.current_price.eur,
                    ils: data.market_data.current_price.ils,
                    time: time
                  };
                  
                  
                  localStorage.setItem(data.id, JSON.stringify(details));

                  setTimeout(() => localStorage.removeItem(data.id, JSON.stringify(details)), 120000 );
                    $(".loader").hide();
                  

                    $(`#${data.id}.in`).html(`
                <h6>symbol:<img id="smaller" src="${
                  data.image.small
                }" alt="symbol"> USD:<small  class="text-muted"> ${data.market_data.current_price.usd.toLocaleString(
                      "en-IL"
                    )} $</small></h6>
                <h6>EUR:<small class="text-muted"> ${data.market_data.current_price.eur.toLocaleString(
                  "en-IL"
                )}  €</small> ILS:<small class="text-muted"> ${data.market_data.current_price.ils.toLocaleString(
                      "en-IL"
                    )} ₪</small> </h6>`);

                    $(`#${data.id}.in`).hide(0);
                    $(`#${data.id}.in`).slideToggle("slow");
                
                  
                  
                });
              }else {
                $(".loader").hide();
                $(`#${coin.id}.in`).slideToggle("slow");
              }
            }  else {
            
              $(".loader").hide();
            
              if ($(`#${coin.id}.in`).text() == "") {
                details = JSON.parse(localStorage.getItem(coin.id));
                $(`#${coin.id}.in`).html(`
            <h6>symbol:<img id="smaller" src="${
              details.img
            }" alt="symbol"> USD:<small  class="text-muted"> ${details.usd.toLocaleString(
                  "en-IL"
                )} $</small></h6>
            <h6>EUR:<small class="text-muted"> ${details.eur.toLocaleString(
              "en-IL"
            )}  €</small> ILS:<small class="text-muted"> ${details.ils.toLocaleString(
                  "en-IL"
                )} ₪</small> </h6>`);
                $(`#${coin.id}.in`).hide(0);
                $(`#${coin.id}.in`).slideToggle("slow");
              } else {
                $(`#${coin.id}.in`).slideToggle("slow");
              }
            }
          });
        }
        drawcd(coin);
      }
    

      $("#btn1").click(filter)
        function filter() {
        $(".loader").show();
        $(".coins").html("");
        let filtered = arr.filter(
          (coin) => coin.symbol.toLowerCase() == $("input").val().toLowerCase()
        );
        $(".loader").hide();
        if (filtered.length == 0) {
          $(".coins").append("<h5>Currency not found</h5>");
        } else {
          let coin = filtered[0];
          drawcd(coin);
         
          for (const i of arr2) {
            $(`.form-check-input#${i.coinid}`).prop("checked", true);
          }
          $(`.form-check-input`).click(chooseCoins)
         
        }
      };
   
      $('.form-control').keyup(function(e){
        if(e.keyCode == 13){
          filter()
        }
      })
      
      let arr2 = [];

      $(`.form-check-input`).click(chooseCoins)
        function chooseCoins(e) {
        
        let coinid = e.target.id;
        let name = $(e.currentTarget).parent().parent().children().first().text();
       
       
        if (arr2.length < 5) {
          if (e.target.checked == true) {
            arr2.push({ coinid, name });
          } else {
           arr2 = arr2.filter(coin => coin.coinid != coinid);
           for (const i of arr2) {
             console.log(i.coinid)
           }
          }
         
        } else {
          if (e.target.checked == false) {
            $(`.form-check-input#${coinid}`).prop("checked", false);
            arr2 = arr2.filter(coin => coin.coinid != coinid);
          } else {
            e.preventDefault();
            $(".changebtn").css("display", "block");

            $("#currentcoin").html(e.target.id);
            $(".canc").click(function () {
              $(".changebtn").css("display", "none");
            });
            
            $(".minicd").html("");
            for (const item of arr2) {
              $(".minicd").append(
                ` <div class="col-sm-6" style="width:auto; margin:1%"  >
                            <div class="card" id="go" style="width:200px; height:100;">
                                <div class="card-body">
                                    <h5 class="card-title">${item.name}</h5>
                                    <div class="form-check form-switch">
                                    <input class="form-check-input indiv" type="checkbox" checked="true" role="switch" id="${item.coinid}">
                                    <label class="form-check-label" for="${item.coinid}"></label>
                                    </div>
                                    <p class="card-text">${item.coinid}</p>
                                    
                                </div>
                            </div>
                          </div>`
              );
            }

            $(`.indiv`).click(function (e) {
              if ($('input[type="checkbox"]:checked')) {
                let id = e.currentTarget.id;
                if (e.target.checked == false) {
                  $(`.form-check-input#${id}`).prop("checked", false);
                  $(`.form-check-input#${coinid}`).prop("checked", true);
                  $(".changebtn").css("display", "none");
                  arr2.push({ coinid, name });
                  arr2 = arr2.filter((e) => e.coinid != id);
                }
              }
            });
          }
        }
      };

      
      $(".page1").click(() => {
        $(".loader").show();
        $(".coins").html("");
        
        for (const coin of arr) {
          $(".loader").hide();
          drawcd(coin);
        }
        for (const i of arr2) {
          $(`.form-check-input#${i.coinid}`).prop("checked", true);
        }
        $(`.form-check-input`).click(chooseCoins)
       
      });



      let arr3=[]
      
       $(".page2").click(function(){  
        if(arr2.length == 0 ){
    
         alert("You need to select coins!")
  
        }
        
        if (arr2.length != 0){
        
        $(".coins").html("");
        $(".coins").append(`<div id="chartContainer" style="height: 300px; width: 100%;"></div>`)
  
        

        for (const coin of arr) {
          for (const i of arr2) {
            let id = i.coinid
             if(id.includes(coin.id)){
            arr3.push(coin.symbol.toUpperCase())
            }
          }
        }
      
          let options = {
            exportEnabled: true,
            animationEnabled: true,
            title:{
              text: "Real-time reports"
            },
            subtitles: [{
              text: "Click Legend to Hide or Unhide Data Series"
            }],
            axisX: {
              valueFormatString: "HH:mm:ss"
            },
            axisY: {
              title: "Coin Value",
              titleFontColor: "#4F81BC",
              lineColor: "#4F81BC",
              labelFontColor: "#4F81BC",
              tickColor: "#4F81BC"
            },
            
            toolTip: {
              shared: true
            },
            legend: {
              cursor: "pointer",
              itemclick: toggleDataSeries
            },
            data: []
            
          };
         
          
          $.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${arr3}&tsyms=USD`, function(coins){
         
            let chart = $("#chartContainer").CanvasJSChart()
            
            for (let i in coins) {
             
              let idata ={
                type: "spline",
                name: i,
                showInLegend: true,
                xValueFormatString: "HH mm ss",
                yValueFormatString: "#,##0 Units",
                dataPoints: [{x: new Date , y: coins[i].USD}]
                 
              }
              options.data.push(idata)
              
              console.log(idata)
              
            }
            chart.render()
            
          })
        
           let interval= setInterval(() => {
             let chart = $("#chartContainer").CanvasJSChart()
            $.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${arr3}&tsyms=USD`, function(coins){
              let count = 0

              for (const key in coins) {
              
              chart.options.data[count].dataPoints.push({x: new Date() , y: coins[key].USD})
                
  
              count++  
                
              }
            
            })
          chart.render()
          $(".page1").click(() => { clearInterval(interval)})
          $(".page3").click(() => { clearInterval(interval)})
          }, 2000);

          $("#chartContainer").CanvasJSChart(options);
            
          function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
              e.dataSeries.visible = false;
            } else {
              e.dataSeries.visible = true;
            }
            e.chart.render();
          }
        

          
         
        }
      })
      

      $(".page3").click(function () {
        $(".loader").show();
        $(".coins").html("");
        $(".loader").hide();
        $(".coins").append(`
      <div class="card mb-3" style="max-width: 600px;">
          <div class="row g-0">
          <div class="col-md-4">
          <img src="skay.jpg" class="img-fluid rounded-start" alt="...">
          </div>
          <div class="col-md-8">
          <div class="card-body">
          <h5 class="card-title">Eden's Project</h5>
          <p class="card-text">
          This is my second project in my studies at john bryce.
          In my project I used jquery, AJAX Api and Bootstrap.
          <br>
          hope you enjoyed 😊   .</p>
          <p class="card-text"><small class="text-muted">Eden Arbiv || 22 || Hadera.</small></p>
          </div>
          </div>
          </div>
          </div>
      `);
      });

      
    }
  );
});
