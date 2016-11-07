import React, {Component} from 'react';
import ShadowDOM from 'react-shadow';
import {observer} from 'mobx-react';
import {memoize} from 'lodash';
import {decorate} from 'core-decorators';

@observer
class Demo extends Component {
  render() {
    const innerHTML = this.getBodyInnerHTML(this.props.contents.html);
    return (
      <div id="shadowDOMParent">
      <ShadowDOM>
        <div>
          <div dangerouslySetInnerHTML={{__html: innerHTML}}></div>
          <style>{this.props.contents.css[1]}</style>
          {/* <script src="/demo/scripts/index.js"></script> */}
        </div>
      </ShadowDOM>
      </div>
    );
  }

  @decorate(memoize)
  getBodyInnerHTML(html) {
    const matches = html.match(/<body>([\s\S]*)?<\/body>/);
    if (matches === null) {
      return html;
    }
    return matches[1];
  }
}

export default Demo;
