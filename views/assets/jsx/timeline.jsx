
var TimelineBlock = React.createClass({
  render: function() {
    return (
      <div className="cd-timeline-block">
          <div className="cd-timeline-img">
            <img src="/assets/img/cd-icon-picture.svg" alt="Picture" />
          </div>
          <div className="cd-timeline-content">
            <a className="cd-link" id={this.props.block.id} href={'#' + this.props.block.id}>
              <h2>{this.props.title}</h2>
            </a>
            <p dangerouslySetInnerHTML={{__html: this.props.children}} />
            <a href="#0" className="cd-read-more">Read more</a>
            <span className="cd-date">{this.props.date}</span>
          </div>
      </div>
    );
  }
});

var TimelineBlocks = React.createClass({
  render: function() {
    var blockNodes = this.props.data.map(function(block) {
      return (
        <TimelineBlock block={block} title={block.title} date={block.rangeLabel}>{block.desc}</TimelineBlock>
      );
    });
    return (
      <div>
        {blockNodes}
      </div>
    );
  }
});

var TimelineBox = React.createClass({
  loadDataFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        console.log('data', data);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadDataFromServer();
    //setInterval(this.loadDataFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <section id="cd-timeline" className="cd-container">
      <TimelineBlocks data={this.state.data} />
      </section>
    );
  }
});



ReactDOM.render(
  <TimelineBox url="/assets/data.json" pollInterval={2000} />,
  document.getElementById('example')
);
