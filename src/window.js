import {
    app
} from 'click.cl';
import './ClickTyper';

new app('window', {
    view: (`<div>
        <div class="{expandClass}">
            <div class="titlebar">
                <div class="buttons">
                    <div class="close" c-click='close'>
                        <a class="closebutton" href="#"></a>
                    </div>
                    <div class="minimize">
                        <a class="minimizebutton" href="#"></a>
                    </div>
                    <div class="zoom" c-click='expand'>
                        <a class="zoombutton" href="#"></a>
                    </div>
                </div>
                <div class='title'>{windowName}</div>
            </div>
            <div class="Screen" c-view='viewWindow'>
                <div c-loop="commands>>item">
                    <p class="command">{item}</p>
                </div>
                <p class="command">
                    <c-ClickTyper typespeed="100" erasespeed='50' text=" Welcome to click.cl | Your click.cl was installed successfully | This is your welcome page | Happy click day ^_^ . " endsymbol="_" />
                </p>
            </div>
        </div>
    </div>`),

    props: ['title'],

    state: function($) {
        return $.state('windowName')({
            expand: false,
            expandClass: '',
            viewWindow: true,
            commands: [
                '$ npm i click.cl',
                'Installing Click.cl..[>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>]',
                'Installed successfully'
            ]
        });
    },

    fn: {
        expand: function() {
            this.expand = !this.expand;
        },
        close: function() {
            this.viewWindow = !this.viewWindow;
        }
    },

    auto: {
        expand: function(pass) {
            this.expandClass = pass ? ' ' : 'window';
            return pass;
        }
    },




    '@css': {
        'a': {
            'text-decoration': 'none'
        },
        'span': {
            'line-height': '9px',
            'vertical-align': '50%'
        },
        '.window': {
            'background': '#fff',
            'width': '50vw',
            'height': '50vh',
            'margin': 'auto',
            'margin-top': '12.5vh',
            'border': '1px solid #acacac',
            'border-radius': '6px',
            'box-shadow': '0px 0px 20px #acacac'
        },
        '.titlebar': {
            'background': '#bbb',
            'color': '#ffffff',
            'font-size': '13pt',
            'font-weight': 'bolder',
            'line-height': '20px',
            'text-align': 'center',
            'width': '100%',
            'height': '25px',
            'border-top': '1px solid #f3f1f3',
            'border-bottom': '1px solid #b1aeb1',
            'border-top-left-radius': '6px',
            'border-top-right-radius': '6px',
            'user-select': 'none',
            '-webkit-user-select': 'none',
            '-moz-user-select': 'none',
            '-ms-user-select': 'none',
            '-o-user-select': 'none',
            'cursor': 'default',
        },
        '.buttons': {
            'padding-left': '8px',
            'padding-top': '3px',
            'float': 'left',
            'line-height': '0px'
        },
        '.close': {
            'background': '#ff5c5c',
            'font-size': '9pt',
            'width': '15px',
            'height': '15px',
            'border': '1px solid #e33e41',
            'border-radius': '50%',
            'display': 'inline-block',
        },
        '.close:active': {
            'background': '#c14645',
            'border': '1px solid #b03537',
        },
        '.close:active .closebutton': {
            'color': '#4e0002',
        },
        '.closebutton': {
            'color': '#820005',
            'visibility': 'hidden',
            'cursor': 'default',
        },
        '.minimize': {
            'background': '#ffbd4c',
            'font-size': '9pt',
            'line-height': '11px',
            'margin-left': '4px',
            'width': '15px',
            'height': '15px',
            'border': '1px solid #e09e3e',
            'border-radius': '50%',
            'display': 'inline-block',
        },
        '.minimize:active': {
            'background': '#c08e38',
            'border': '1px solid #af7c33',
        },
        '.minimize:active .minimizebutton': {
            'color': '#5a2607',
        },
        '.minimizebutton': {
            'color': '#9a5518',
            'visibility': 'hidden',
            'cursor': 'default',
        },
        '.zoom': {
            'background': '#00ca56',
            'font-size': '9pt',
            'line-height': '11px',
            'margin-left': '6px',
            'width': '15px',
            'height': '15px',
            'border': '1px solid #14ae46',
            'border-radius': '50%',
            'display': 'inline-block',
        },
        '.zoom:active': {
            'background': '#029740',
            'border': '1px solid #128435',
        },
        '.zoom:active .zoombutton': {
            'color': '#003107',
        },
        '.zoombutton': {
            'color': '#006519',
            'visibility': 'hidden',
            'cursor': 'default',
        },
        '.Screen': {
            'background-color': '#151515',
            'box-sizing': 'border-box',
            'height': '100%',
            'margin': '0 auto',
            'padding': '20px',
            'border-bottom-left-radius': '5px',
            'border-bottom-right-radius': '5px',
        },
        'h3': {
            'margin-top': '0px',
        },
        '.command': {
            'color': '#CDEE69',
            'font-weight': 'bolder',
            'font-size': '19px;'
        },
        '.title': {
            'padding': '3px 6px'
        }
    }
})