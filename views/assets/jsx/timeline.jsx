
var TimelineBlock = React.createClass({
  render: function() {
    var displaySR      = this.props.block.labels.indexOf('sprint-review') !== -1 ? 'block' : 'none';
    var displayCOMM    = this.props.block.labels.indexOf('communication') !== -1 ? 'block' : 'none';
    var displayGOAL    = this.props.block.labels.indexOf('objectif') !== -1 ? 'block' : 'none';
    var displayREU     = this.props.block.labels.indexOf('reunion') !== -1 ? 'block' : 'none';
    var displayDEFAULT = (displaySR == 'none' && displayCOMM == 'none' && displayGOAL == 'none' && displayREU == 'none') ? 'block' : 'none';
    return (
      <div className="cd-timeline-block">

          <div className="cd-timeline-img cd-reunion" style={{display: displayREU}}>
            <img src="/assets/img/reunion.png" alt="Réunion" />
          </div>
          <div className="cd-timeline-img cd-presentation" style={{display: displayCOMM}}>
            <img src="/assets/img/communication.png" alt="Communication" />
          </div>
          <div className="cd-timeline-img cd-sprintreview" style={{display: displaySR}}>
            <img src="/assets/img/sprintreview.png" alt="Revue de sprint" />
          </div>
          <div className="cd-timeline-img cd-goal" style={{display: displayGOAL}}>
            <img src="/assets/img/cd-icon-location.svg" alt="Objectif, fonctionnalité ..." />
          </div>
          <div className="cd-timeline-img cd-default" style={{display: displayDEFAULT}}></div>
          <div className="cd-timeline-content">
            <a className="cd-link" id={this.props.block.idCard} href={'#' + this.props.block.idCard}>
              <h2>{this.props.block.title}</h2>
            </a>
            <p className="cd-desc" dangerouslySetInnerHTML={{__html: this.props.block.desc}} />
            <span className="cd-date">{this.props.block.rangeLabel}</span>
            <a className="cd-trello" href={this.props.block.trelloLink}>
              <img src="/assets/img/trello.png" alt="Carte trello" width="16px" />
            </a>
          </div>
      </div>
    );
  }
});

var TimelineBlocks = React.createClass({
  render: function() {
    var blockNodes = this.props.data.map(function(block) {
      return (
        <TimelineBlock key={block._wid} block={block._content.json}>{block._content.desc}</TimelineBlock>
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
  componentDidUpdate: function () {
    // once render is done, try to scroll to the
    // aimed block.
    // ie: scroll to the choosen hash (trello card)
    if (document.location.hash) {
      $('html, body').animate({
        scrollTop: $(document.location.hash).offset().top
      }, 1000);
    }
  },
  render: function() {
    return (
      <section id="cd-timeline" className="cd-container">
      <TimelineBlocks data={this.state.data} />
      </section>
    );
  }
});

var mqs = require('mongodb-querystring');
var qry = {
  "alt" : "raw",
  "$query" : {
    "_content.json.date" : {
      "$gte" : new Date(2015, 4, 24, 18, 30)
    },
    "$or": [
      {
        "_content.json.projectKey" : "ezPAARSE"
      },
      {
        "_content.json.projectKey" : "ISTEX-API"
      }
    ]
  },
  "$limit" : 50,
  "$orderby" : {
    "_content.json.date" : 1
  }
}
ReactDOM.render(
  <TimelineBox url={String('/data/*?').concat(mqs.stringify(qry, {}))} pollInterval={2000} />,
  document.getElementById('example')
);
