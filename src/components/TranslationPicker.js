import React from 'react';
import TranslationActionCreator from '../actions/TranslationActionCreator.js';
import TranslationStore from '../stores/TranslationStore.js';
import TranslatedComponent from '../utils/TranslatedComponent.js';

class TranslationPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };

    this.onLanguageChanged = this.handleLanguageChanged.bind(this);
  }

  componentDidMount() {
    TranslationStore.addChangeListener(this.onLanguageChanged);
  }

  componentWillUnmount() {
      TranslationStore.removeChangeListener(this.onLanguageChanged);
  }

  handleLanguageChanged() {
    this.setState({
      isLoading: false,
    });
  }

  handlePickLanguage(languageCode) {
    TranslationActionCreator.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode );
    this.setState({
      isLoading: true,
    });
  }

  render() {
    let {isLoading} = this.state;
    let activeLanguage = TranslationStore.getCurrentLanguage().code;

    return (
      <div className="language-picker">
        <p>{this.translate('languages')}</p>
        {TranslationStore.getAvailableLanguages().map((language, index) =>
          <div key={index}
                  className={ language.code === localStorage.getItem('language') ? 'lanActive' : '' }
                  disabled={isLoading}
                  onClick={this.handlePickLanguage.bind(this, language.code)}>
            {this.translate('languages.'+language.code)}
          </div>
        )}
      </div>
    );
  }
}

TranslationPicker.propTypes = {
};
TranslatedComponent(TranslationPicker);
export default TranslationPicker;