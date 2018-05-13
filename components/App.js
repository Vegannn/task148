App = React.createClass({
    getInitialState() {
        return {
            loading: false,
            searchingText: '',
            gif: {}
        };
    },

    handleSearch: function(searchingText) {  // 1.
        this.setState({
            loading: true  // 2.
        });
        this.getGif(searchingText, function(gif) {  // 3.
            this.setState({  // 4
                loading: false,  // a
                gif: gif,  // b
                searchingText: searchingText  // c
            });
        }.bind(this));
    },

    getGif: function(searchingText, callback) {  // 1.
        var url = CONFIG.GIPHY_API_URL + '/v1/gifs/random?api_key=' + CONFIG.GIPHY_PUB_KEY + '&tag=' + searchingText;  // 2.
        var xhr = new XMLHttpRequest();  // 3.
        xhr.open('GET', url);
        xhr.onload = function() {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText).data; // 4.
                var gif = {  // 5.
                    url: data.fixed_width_downsampled_url,
                    sourceUrl: data.url
                };
                callback(gif);  // 6.
            }
        };
        xhr.send();
    },
    
    getGif2: function(searchingText,callback){
        return new Promise(
            function (resolve, reject) {
                var url = CONFIG.GIPHY_API_URL + '/v1/gifs/random?api_key=' + CONFIG.GIPHY_PUB_KEY + '&tag=' + searchingText;  // 2.
                var xhr = new XMLHttpRequest();  // 3.

                xhr.onload = function() {
                    if (this.status === 200) {
                        resolve(
                            var data = JSON.parse(xhr.responseText).data; // 4.
                            var gif = {  // 5.
                                url: data.fixed_width_downsampled_url,
                                sourceUrl: data.url
                            };
                            callback(gif);  // 6.
                        ); // Sukces
                    } else {
                        reject(new Error(this.statusText)); // Dostaliśmy odpowiedź, ale jest to np 404
                    }
                };
                xhr.open('GET', url);
                xhr.send();
            });
    },

    render: function() {

        var styles = {
            margin: '0 auto',
            textAlign: 'center',
            width: '90%'
        };

        return (
          <div style={styles}>
                <h1>Wyszukiwarka GIFow!</h1>
                <p>Znajdź gifa na <a href='http://giphy.com'>giphy</a>. Naciskaj enter, aby pobrać kolejne gify.</p>
                <Search onSearch={this.handleSearch}/>
            <Gif
                loading={this.state.loading}
                url={this.state.gif.url}
                sourceUrl={this.state.gif.sourceUrl}
            />
          </div>
        );
    }
});