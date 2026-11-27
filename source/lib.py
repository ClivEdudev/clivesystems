# Shared helpers for generating the Clive site: string registry (en/uz/ru), icons, logo, layout.
import html as _html, math, json

STR = {}      # key -> {'en','uz','ru'}
JS_KEYS = set()

def _reg(key, en, uz, ru):
    if key in STR:
        if STR[key]['en'] != en:
            raise ValueError('key clash: ' + key)
        return
    STR[key] = {'en': en, 'uz': uz, 'ru': ru}

def T(key, en, uz, ru, tag='span', cls='', attrs=''):
    """Translatable element. English is written into the HTML; uz/ru go to i18n.js."""
    _reg(key, en, uz, ru)
    h = ' data-html' if '<' in en else ''
    c = f' class="{cls}"' if cls else ''
    a = f' {attrs}' if attrs else ''
    return f'<{tag}{c}{a} data-i18n="{key}"{h}>{en}</{tag}>'

def A(key, en, uz, ru):
    """Translatable attribute value: returns English, caller adds data-i18n-attr."""
    _reg(key, en, uz, ru)
    return esc(en)

def J(key, en, uz, ru):
    """String used from JavaScript (English exported too)."""
    _reg(key, en, uz, ru)
    JS_KEYS.add(key)
    return key

def esc(s):
    return _html.escape(str(s), quote=True)

# ---------------------------------------------------------------- icons (24px stroke set)
IC = {
 'rain': '<path d="M7 15.5a4.2 4.2 0 0 1-.8-8.3A6 6 0 0 1 17.8 6 4.8 4.8 0 0 1 17.5 15.5"/><path d="M8 18.5l-1 2.5M12 18.5l-1 2.5M16 18.5l-1 2.5"/>',
 'river': '<path d="M2 8.5c2.2 0 2.2-2 4.4-2s2.2 2 4.4 2 2.2-2 4.4-2 2.2 2 4.4 2 2.2-2 2.4-2"/><path d="M2 14c2.2 0 2.2-2 4.4-2s2.2 2 4.4 2 2.2-2 4.4-2 2.2 2 4.4 2 2.2-2 2.4-2"/><path d="M5 19.5c2 0 2-1.6 4-1.6s2 1.6 4 1.6 2-1.6 4-1.6 2 1.6 3 1.6"/>',
 'waves': '<path d="M2 17c2.5 0 2.5-2.5 5-2.5s2.5 2.5 5 2.5 2.5-2.5 5-2.5 2.5 2.5 5 2.5"/><path d="M3 11.5c1.5-4 6-6 10-4.2-2.4.2-3.6 2-2.6 3.6 1.8-1.6 5.8-1.6 8.6 1.2"/>',
 'wind': '<path d="M3 8.5h10.5a2.8 2.8 0 1 0-2.8-2.8"/><path d="M3 12.5h15.5a2.8 2.8 0 1 1-2.8 2.8"/><path d="M3 16.5h7"/>',
 'bird': '<path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.3-2.3L2 20"/><path d="M20 7l2 .5-2 .5"/><path d="M10 18v3M14 17.8V21"/><path d="M7 18a6 6 0 0 0 3.8-10.6"/>',
 'home': '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 'orbit': '<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-25 12 12)"/><circle cx="20.2" cy="7.6" r="1.6" fill="currentColor" stroke="none"/>',
 'layers': '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
 'cap': '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.2v4.8c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.8"/><path d="M22 9v6"/>',
 'feather': '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
 'bag': '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
 'user': '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
 'users': '<circle cx="9" cy="8" r="3.5"/><path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6"/><path d="M16 4.2a3.5 3.5 0 0 1 0 7.6M18 15c2.4.6 4 2.6 4 6"/>',
 'send': '<path d="M21.5 2.5L10.5 13.5"/><path d="M21.5 2.5l-7 19-4-8.5-8.5-4z"/>',
 'id': '<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="11" r="2.3"/><path d="M5.8 16c.6-1.4 1.8-2.2 3.2-2.2s2.6.8 3.2 2.2M14.5 10h4M14.5 13.5h3"/>',
 'palette': '<path d="M12 3a9 9 0 1 0 0 18c1 0 1.6-.7 1.6-1.5 0-1.2-1-1.5-1-2.6 0-1 .8-1.6 1.9-1.6H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1.2" fill="currentColor"/><circle cx="10.5" cy="7.2" r="1.2" fill="currentColor"/><circle cx="15" cy="7.6" r="1.2" fill="currentColor"/>',
 'link': '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
 'leaf': '<path d="M4 20c1-9 6-15 16-16-1 10-7 15-16 16z"/><path d="M4 20l9-9"/>',
 'sprout': '<path d="M12 21v-8"/><path d="M12 13c0-4-3-6.5-7-6.5 0 4 3 6.5 7 6.5z"/><path d="M12 11c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5z"/>',
 'star': '<path d="M12 2.5l2.3 6.4 6.7.3-5.3 4.1 1.9 6.5L12 16l-5.6 3.8 1.9-6.5L3 9.2l6.7-.3z"/>',
 'sparkle': '<path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" fill="currentColor" stroke="none"/>',
 'globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
 'video': '<rect x="2" y="6" width="14" height="12" rx="2.5"/><path d="M16 10l6-3.2v10.4L16 14"/>',
 'timer': '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 10v3.5l2.2 2M9.5 2.5h5"/>',
 'moon': '<path d="M20.5 14A8.5 8.5 0 1 1 10 3.5a6.6 6.6 0 0 0 10.5 10.5z"/>',
 'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 'auto': '<circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"/>',
 'mail': '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
 'search': '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
 'menu': '<path d="M4 7h16M4 12h16M4 17h10"/>',
 'x': '<path d="M6 6l12 12M18 6L6 18"/>',
 'sliders': '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
 'arrow': '<path d="M5 12h14M13 6l6 6-6 6"/>',
 'back': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
 'ext': '<path d="M7 17L17 7M8 7h9v9"/>',
 'check': '<path d="M5 12.5l4.5 4.5L19 7"/>',
 'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 'calendar': '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 'book': '<path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5z"/><path d="M5 20.5A2.5 2.5 0 0 1 7.5 18H19v3H7.5"/>',
 'code': '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
 'git': '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5c0 3.5-3.5 4.5-7 4.5H8.2"/>',
 'youtube': '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z" fill="currentColor"/>',
 'play': '<path d="M7 4.5l12 7.5-12 7.5z" fill="currentColor"/>',
 'pause': '<rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor"/><rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor"/>',
 'stop': '<rect x="5.5" y="5.5" width="13" height="13" rx="2" fill="currentColor"/>',
 'download': '<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
 'upload': '<path d="M12 21V9M7 14l5-5 5 5M4 4h16"/>',
 'copy': '<rect x="8" y="8" width="13" height="13" rx="2.5"/><path d="M16 8V5.5A2.5 2.5 0 0 0 13.5 3h-8A2.5 2.5 0 0 0 3 5.5v8A2.5 2.5 0 0 0 5.5 16H8"/>',
 'bolt': '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
 'pin': '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
 'cloud': '<path d="M7 18.5a4.2 4.2 0 0 1-.8-8.3A6 6 0 0 1 17.8 9 4.8 4.8 0 0 1 17.5 18.5z"/>',
 'lock': '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
 'flame': '<path d="M12 22c4 0 7-2.7 7-7 0-4-3-6-4-9-1 2-2 3-3.5 3.5C11 7 11 4 9 2c0 4-4 6.5-4 12 0 4.3 3 8 7 8z"/>',
 'coin': '<circle cx="12" cy="12" r="9"/><path d="M12 6.5v11M14.6 9.2c0-1-1.1-1.7-2.6-1.7s-2.6.7-2.6 1.8c0 2.6 5.3 1.4 5.3 4 0 1.2-1.2 1.9-2.7 1.9s-2.7-.7-2.7-1.7"/>',
 'tag': '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.3" fill="currentColor"/>',
 'chart': '<path d="M4 20V11M10 20V5M16 20v-6M2 20.5h20"/>',
 'list': '<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4.5" cy="6" r="1" fill="currentColor"/><circle cx="4.5" cy="12" r="1" fill="currentColor"/><circle cx="4.5" cy="18" r="1" fill="currentColor"/>',
 'plus': '<path d="M12 5v14M5 12h14"/>',
 'minus': '<path d="M5 12h14"/>',
 'trash': '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
 'volume': '<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
 'mute': '<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M22 9l-6 6M16 9l6 6"/>',
 'max': '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
 'pip': '<rect x="2" y="4" width="20" height="16" rx="2.5"/><rect x="12" y="11" width="7.5" height="6" rx="1" fill="currentColor"/>',
 'bell': '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
 'trophy': '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4v2a4 4 0 0 0 4 3M16 6h4v2a4 4 0 0 1-4 3"/><path d="M12 13v4M8 21h8M9.5 17h5"/>',
 'refresh': '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
 'info': '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.3"/>',
 'chevl': '<path d="M15 6l-6 6 6 6"/>',
 'chevr': '<path d="M9 6l6 6-6 6"/>',
 'chevd': '<path d="M6 9l6 6 6-6"/>',
 'eye': '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 'type': '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
 'headphones': '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/>',
 'target': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
 'mic': '<rect x="9" y="2.5" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5"/>',
 'shield': '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
 'grid': '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
 'music': '<path d="M9 18V5.5l12-2.2v12.5"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
 'hourglass': '<path d="M6 3h12M6 21h12M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9s10 4 10 9"/>',
 'phone': '<rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M10.5 18.5h3"/>',
 'monitor': '<rect x="2.5" y="4" width="19" height="13" rx="2.5"/><path d="M8.5 21h7M12 17v4"/>',
 'wifi': '<path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1.2" fill="currentColor"/>',
 'wand': '<path d="M15 4V2M15 10V8M11 6h2M17 6h2M4 20l11-11 1.5 1.5L5.5 21.5z"/>',
 'hand': '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V5.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 7-6.5 7-3 0-4.5-1.5-6-4l-1.8-3a1.5 1.5 0 0 1 2.5-1.6L8 15"/>',
 'quote': '<path d="M9 7H5v6h4v-1c0 2-1 4-3 5M19 7h-4v6h4v-1c0 2-1 4-3 5"/>',
 'board': '<rect x="2.5" y="3.5" width="19" height="13" rx="2"/><path d="M12 16.5V21M8 21h8M6.5 8h7M6.5 11.5h4"/>',
 'game': '<rect x="2.5" y="7" width="19" height="11" rx="5.5"/><path d="M7.5 10.5v4M5.5 12.5h4"/><circle cx="15.5" cy="11.5" r="1" fill="currentColor"/><circle cx="17.5" cy="13.5" r="1" fill="currentColor"/>',
 'cards': '<rect x="7" y="3" width="13" height="16" rx="2.5"/><path d="M4.5 6.5v12A2.5 2.5 0 0 0 7 21h9"/>',
 'brain': '<path d="M9 4.5A2.5 2.5 0 0 0 6.5 7 3 3 0 0 0 4 10a3 3 0 0 0 1 2.3A3 3 0 0 0 6.5 18 2.5 2.5 0 0 0 9 20.5 2.5 2.5 0 0 0 12 19V5.5A2.5 2.5 0 0 0 9 4.5zM15 4.5A2.5 2.5 0 0 1 17.5 7 3 3 0 0 1 20 10a3 3 0 0 1-1 2.3 3 3 0 0 1-1.5 5.7A2.5 2.5 0 0 1 15 20.5 2.5 2.5 0 0 1 12 19"/>',
 'radar': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12l6-6"/>',
 'wave': '<path d="M2 12c2 0 2-5 4-5s2 10 4 10 2-14 4-14 2 18 4 18 2-9 4-9"/>',
 'bridge': '<path d="M2 18h20M4 18v-6M20 18v-6M2 12c4-6 16-6 20 0M9 18v-4.5M15 18v-4.5"/>',
 'train': '<rect x="5" y="3" width="14" height="14" rx="4"/><path d="M5 11h14M8.5 21l2-4M15.5 21l-2-4"/><circle cx="9" cy="14" r=".8" fill="currentColor"/><circle cx="15" cy="14" r=".8" fill="currentColor"/>',
 'scissors': '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.2 8.2L20 20M8.2 15.8L20 4"/>',
 'image': '<rect x="3" y="3.5" width="18" height="17" rx="2.5"/><circle cx="9" cy="9.5" r="2"/><path d="M21 16l-5-5L5 20.5"/>',
 'pen': '<path d="M4 20l4.5-1L19 8.5a2.1 2.1 0 0 0-3-3L5.5 16z"/>',
 'zap': '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
 'store': '<path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9c0 1.7 1.3 3 3 3s2.7-1.3 2.7-3c0 1.7 1.2 3 2.3 3s2.3-1.3 2.3-3c0 1.7 1 3 2.7 3s3-1.3 3-3M10 20v-5h4v5"/>',
 'bed': '<path d="M3 18V6M3 13h18v5M21 13v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="10" r="2"/>',
 'sofa': '<path d="M4 11V8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3"/><path d="M2 13a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2zM5 18v2M19 18v2"/>',
 'burger': '<path d="M4 10a8 5 0 0 1 16 0z"/><path d="M3 13.5h18M4 17h16a0 0 0 0 1 0 0 2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17z"/>',
 'school': '<path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-5h6v5"/>',
 'rocket': '<path d="M5 15c-1.5 1.5-2 4.5-2 6 1.5 0 4.5-.5 6-2M9 15l-3-3c1-4 5-9 14-9 0 9-5 13-9 14z"/><circle cx="15" cy="9" r="1.8"/>',
 'repeat': '<path d="M17 2l3 3-3 3M3 11V9a4 4 0 0 1 4-4h13M7 22l-3-3 3-3M21 13v2a4 4 0 0 1-4 4H4"/>',
 'heart': '<path d="M12 20s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.2-8 11-8 11z"/>',
}

def ic(name, cls=''):
    c = f' class="{cls}"' if cls else ''
    return f'<svg{c} aria-hidden="true"><use href="#i-{name}"/></svg>'

def sprite():
    out = ['<svg width="0" height="0" style="position:absolute" aria-hidden="true">']
    for k, v in IC.items():
        out.append(f'<symbol id="i-{k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">{v}</symbol>')
    out.append('</svg>')
    return ''.join(out)

# ---------------------------------------------------------------- logo: khatam star opening into a C, with an orbit
def _star_pts(cx, cy, R, rot=-90):
    r = R * math.cos(math.radians(45)) / math.cos(math.radians(22.5))
    pts = []
    for k in range(16):
        ang = math.radians(rot + k * 22.5)
        rad = R if k % 2 == 0 else r
        pts.append((cx + rad * math.cos(ang), cy + rad * math.sin(ang)))
    return pts

def star_path(cx, cy, R, rot=-90):
    p = _star_pts(cx, cy, R, rot)
    return 'M' + ' L'.join(f'{x:.2f} {y:.2f}' for x, y in p) + 'Z'

def mark(uid='m', size=None, mono=False):
    s = f' width="{size}" height="{size}"' if size else ''
    g1, g2 = ('currentColor', 'currentColor') if mono else ('#7C95FF', '#A985FF')
    planet = 'currentColor' if mono else '#F5C04A'
    return (f'<svg viewBox="0 0 64 64"{s} aria-hidden="true">'
            f'<defs><linearGradient id="{uid}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{g1}"/><stop offset="1" stop-color="{g2}"/></linearGradient>'
            f'<mask id="{uid}k"><rect width="64" height="64" fill="#fff"/><path d="M32 32 L66 13 L66 51 Z" fill="#000"/></mask></defs>'
            f'<g mask="url(#{uid}k)"><path d="{star_path(32,32,25)}" fill="none" stroke="url(#{uid}g)" stroke-width="5.2" stroke-linejoin="round"/></g>'
            f'<circle cx="32" cy="32" r="6.2" fill="url(#{uid}g)"/>'
            f'<ellipse cx="32" cy="32" rx="30" ry="9.5" transform="rotate(-20 32 32)" fill="none" stroke="url(#{uid}g)" stroke-width="1.8" opacity=".75"/>'
            f'<circle cx="57.6" cy="22.4" r="3.6" fill="{planet}"/></svg>')

# ---------------------------------------------------------------- products (shared data)
PRODUCTS = [
 {'id':'vaqt','name':'Vaqt','c':'var(--green)','ci':'#03170d','url':'vaqt/index.html','page':'products/vaqt.html','icon':'leaf','img':None,'phone':None,'ext':False},
 {'id':'clivedu','name':'ClivEdu','c':'var(--blue)','ci':'#fff','url':'https://mellifluous-elf-d3aaf0.netlify.app/','page':'products/clivedu.html','icon':'star','img':'work/clivedu.webp','phone':'phone/clivedu.webp','ext':True},
 {'id':'class','name':'ClivEdu Class','c':'var(--turq)','ci':'#02201e','url':'https://clivedu.me/','page':'products/class.html','icon':'cap','img':'work/class.webp','phone':'phone/class.webp','ext':True},
 {'id':'sprachwerk','name':'Sprachwerk','c':'var(--gold)','ci':'#1a1400','url':'https://sprachwerkclive.netlify.app/','page':'products/sprachwerk.html','icon':'globe','img':'work/sprachwerk.webp','phone':'phone/sprach.webp','ext':True},
 {'id':'vault','name':'Vault Studio','c':'var(--amber)','ci':'#1b0d00','url':'https://wondervaultyoutube.netlify.app/','page':'products/vault-studio.html','icon':'video','img':'work/vault.webp','phone':'phone/vault.webp','ext':True},
]
WHOP_STORE = 'https://whop.com/digital-products-a902/'
WHOP_EBOOK = 'https://whop.com/digital-products-a902/technical-issues-q-a-ebook/'
TG = 'https://t.me/clive077'
EMAIL = 'imonkulovclive@gmail.com'
YT = 'https://www.youtube.com/@wondervaultclive'
GH = 'https://github.com/ClivEdudev'

FONTS = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Unbounded:wght@400;500;600;700&display=swap'

EARLY = ("(function(){var s={};try{s=JSON.parse(localStorage.getItem('clive.settings')||'{}')||{}}catch(e){}"
         "var r=document.documentElement,th=s.theme||r.getAttribute('data-theme')||'dark';"
         "if(th==='auto'){th=window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}"
         "r.setAttribute('data-theme',th);if(s.accent&&s.accent!=='blue')r.setAttribute('data-accent',s.accent);"
         "if(s.motion==='reduced')r.setAttribute('data-motion','reduced');if(s.fs)r.style.setProperty('--fs',s.fs);"
         "var l=s.lang;if(!l){var n=(navigator.language||'en').slice(0,2).toLowerCase();l=(n==='uz'||n==='ru')?n:'en'}"
         "r.lang=l;r.setAttribute('data-lang',l)})();")

# ---------------------------------------------------------------- layout pieces
NAV = [
 ('index', 'nav.home', 'Home', 'Bosh sahifa', 'Главная', 'index.html', 'home'),
 ('ecosystem', 'nav.orbit', 'Orbit', 'Orbita', 'Орбита', 'ecosystem.html', 'orbit'),
 ('work', 'nav.work', 'Work', 'Ishlar', 'Работы', 'work.html', 'layers'),
 ('learn', 'nav.learn', 'Learn', 'O‘rganish', 'Учёба', 'learn.html', 'cap'),
 ('journal', 'nav.journal', 'Journal', 'Kundalik', 'Дневник', 'journal.html', 'feather'),
 ('shop', 'nav.shop', 'Shop', 'Do‘kon', 'Магазин', 'shop.html', 'bag'),
 ('about', 'nav.about', 'About', 'Men haqimda', 'Обо мне', 'about.html', 'user'),
]
for _ in [('nav.contact','Contact','Aloqa','Контакты'),('nav.me','Clive ID','Clive ID','Clive ID'),('nav.brand','Brand kit','Brend to‘plami','Бренд-кит'),('nav.links','Links','Havolalar','Ссылки')]:
    _reg(*_); JS_KEYS.add(_[0])
for n in NAV: JS_KEYS.add(n[1])

def nav(cur, root):
    links = ''.join(f'<a href="{root}{h}"{" aria-current=page" if k==cur else ""}>{T(key,en,uz,ru)}</a>' for k,key,en,uz,ru,h,i in NAV)
    return f'''<header class="nav"><div class="wrap">
<a class="brand" href="{root}index.html" aria-label="Clive home">{mark("nm")}<span>Clive</span></a>
<nav class="navlinks" aria-label="{A('a.main','Main','Asosiy','Основное')}" data-i18n-attr="aria-label:a.main">{links}</nav>
<div class="navtools">
<button class="iconbtn kbtn" data-open="cmdk" aria-label="{A('a.search','Search the orbit','Orbitadan qidirish','Поиск по орбите')}" data-i18n-attr="aria-label:a.search" title="/">{ic('search')}</button>
<div class="langsel" role="group" aria-label="Language"><button data-setlang="en" aria-pressed="true">EN</button><button data-setlang="uz" aria-pressed="false">UZ</button><button data-setlang="ru" aria-pressed="false">RU</button></div>
<button class="iconbtn" data-open="drawer" aria-label="{A('a.settings','Settings','Sozlamalar','Настройки')}" data-i18n-attr="aria-label:a.settings">{ic('sliders')}</button>
<a class="btn primary sm navfocus" href="{root}vaqt/index.html">{ic('leaf')}{T('nav.focus','Focus','Fokus','Фокус')}</a>
<button class="iconbtn burger" data-open="sheet" aria-label="{A('a.menu','Menu','Menyu','Меню')}" data-i18n-attr="aria-label:a.menu">{ic('menu')}</button>
</div></div></header>'''

def sheet(root):
    links = ''.join(f'<a href="{root}{h}">{T(key,en,uz,ru)}{ic("arrow")}</a>' for k,key,en,uz,ru,h,i in NAV)
    links += f'<a href="{root}contact.html">{T("nav.contact","Contact","Aloqa","Контакты")}{ic("arrow")}</a>'
    return f'''<div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-label="Menu">
<div class="top"><a class="brand" href="{root}index.html">{mark("sm")}<span>Clive</span></a><button class="iconbtn" data-close="sheet" aria-label="Close">{ic('x')}</button></div>
<nav>{links}</nav>
<div class="foot">
<a class="btn primary block navfocus" href="{root}vaqt/index.html">{ic('leaf')}{T('sheet.focus','Open Vaqt, the focus garden','Vaqt fokus bog‘ini ochish','Открыть Vaqt — сад фокуса')}</a>
<div class="row"><div class="langsel" role="group" aria-label="Language"><button data-setlang="en">EN</button><button data-setlang="uz">UZ</button><button data-setlang="ru">RU</button></div>
<button class="btn ghost sm" data-open="drawer">{ic('sliders')}{T('a.settings','Settings','Sozlamalar','Настройки')}</button>
<button class="btn ghost sm" data-open="cmdk" data-close="sheet">{ic('search')}{T('a.search2','Search','Qidirish','Поиск')}</button></div>
</div></div>'''

def drawer(root):
    sw = ''.join(f'<button data-set="accent={a}" style="--c:var(--{v})" aria-label="{a}"></button>' for a,v in [('blue','blue'),('turq','turq'),('gold','gold'),('green','green'),('amber','amber'),('rose','rose'),('violet','violet')])
    return f'''<aside class="drawer" id="drawer" aria-hidden="true" aria-label="Settings">
<header><h3>{T('dr.title','Make it yours','O‘zingizga moslang','Настройте под себя')}</h3><button class="iconbtn" data-close="drawer" aria-label="Close">{ic('x')}</button></header>
<div class="body">
<div class="field"><span>{T('dr.theme','Sky','Osmon','Небо')}</span><div class="seg"><button data-set="theme=dark">{ic('moon')}{T('dr.night','Night','Tun','Ночь')}</button><button data-set="theme=light">{ic('sun')}{T('dr.day','Day','Kun','День')}</button><button data-set="theme=auto">{ic('auto')}{T('dr.auto','Auto','Avto','Авто')}</button></div></div>
<div class="field"><span>{T('dr.accent','Accent colour','Asosiy rang','Акцентный цвет')}</span><div class="swatches">{sw}</div></div>
<div class="field"><span>{T('dr.lang','Language','Til','Язык')}</span><div class="seg"><button data-setlang="en">English</button><button data-setlang="uz">O‘zbekcha</button><button data-setlang="ru">Русский</button></div></div>
<div class="field"><span>{T('dr.motion','Motion','Harakat','Анимация')}</span><div class="seg"><button data-set="motion=full">{T('dr.full','Full','To‘liq','Полная')}</button><button data-set="motion=reduced">{T('dr.calm','Calm','Sokin','Спокойная')}</button></div></div>
<div class="field"><span>{T('dr.size','Text size','Matn o‘lchami','Размер текста')}</span><div class="seg"><button data-set="fs=0.92" aria-label="smaller">A−</button><button data-set="fs=1">A</button><button data-set="fs=1.1" aria-label="larger">A+</button></div></div>
<a class="card glow" href="{root}me.html" style="--c:var(--acc)"><div class="row" style="flex-wrap:nowrap"><span class="ico" style="margin:0">{ic('id')}</span><div><b>Clive ID</b><p class="small" style="margin:0">{T('dr.id','Your profile, focus stats and sync code','Profilingiz, fokus statistikasi va sinxron kod','Ваш профиль, статистика фокуса и код синхронизации')}</p></div></div></a>
<p class="small faint">{T('dr.keys','Press <span class="kbd">/</span> or <span class="kbd">Ctrl K</span> to search. Type “clive” anywhere for a surprise.','Qidirish uchun <span class="kbd">/</span> yoki <span class="kbd">Ctrl K</span> ni bosing. Istalgan joyda “clive” deb yozing — kutilmagan sovg‘a bor.','Нажмите <span class="kbd">/</span> или <span class="kbd">Ctrl K</span> для поиска. Наберите «clive» где угодно — будет сюрприз.')}</p>
</div></aside>'''

def cmdk():
    return f'''<div class="cmdk" id="cmdk" role="dialog" aria-modal="true" aria-label="Search">
<div class="q">{ic('search')}<input type="text" autocomplete="off" spellcheck="false" placeholder="{A('cmd.ph','Search pages, products, actions…','Sahifa, mahsulot yoki amalni qidiring…','Страницы, продукты, действия…')}" data-i18n-attr="placeholder:cmd.ph" aria-label="Search"><span class="kbd">Esc</span></div>
<ul role="listbox"></ul></div>'''

for k in [('a.top','Back to top','Yuqoriga','Наверх'),('cmd.g.pages','Pages','Sahifalar','Страницы'),('cmd.g.products','Products','Mahsulotlar','Продукты'),('cmd.g.actions','Actions','Amallar','Действия'),
          ('cmd.focus25','Start a 25-minute focus','25 daqiqalik fokusni boshlash','Начать фокус на 25 минут'),('cmd.theme','Switch day / night','Kun / tunni almashtirish','Переключить день / ночь'),
          ('cmd.email','Copy email address','Email manzilini nusxalash','Скопировать email'),('cmd.none','Nothing found','Hech narsa topilmadi','Ничего не найдено'),('ui.copied','Copied','Nusxalandi','Скопировано')]:
    _reg(*k); JS_KEYS.add(k[0])

def footer(root):
    P = lambda key,en,uz,ru,h: f'<li><a href="{root}{h}">{T(key,en,uz,ru)}</a></li>'
    prods = ''.join(f'<li><a href="{root}{p["page"]}">{p["name"]}</a></li>' for p in PRODUCTS)
    return f'''<footer class="foot"><div class="wrap">
<div class="top">
<div><a class="brand" href="{root}index.html">{mark("fm")}<span>Clive</span></a>
<p class="muted mt1" style="max-width:34ch">{T('ft.about','Teacher, web developer and maker of digital products. Building in Uzbekistan, for phones first.','O‘qituvchi, veb-dasturchi va raqamli mahsulotlar yaratuvchisi. O‘zbekistonda, avvalo telefonlar uchun quraman.','Учитель, веб-разработчик и автор цифровых продуктов. Делаю в Узбекистане, в первую очередь для телефонов.')}</p>
<p class="small faint mt1">{T('ft.time','Tashkent time','Toshkent vaqti','Время в Ташкенте')} · <span class="num" data-tash-clock>--:--</span></p></div>
<div><h4>{T('ft.products','Products','Mahsulotlar','Продукты')}</h4><ul>{prods}</ul></div>
<div><h4>{T('ft.explore','Explore','Ko‘rish','Обзор')}</h4><ul>{P('nav.orbit','Orbit','Orbita','Орбита','ecosystem.html')}{P('nav.work','Work','Ishlar','Работы','work.html')}{P('nav.learn','Learn','O‘rganish','Учёба','learn.html')}{P('nav.journal','Journal','Kundalik','Дневник','journal.html')}{P('nav.shop','Shop','Do‘kon','Магазин','shop.html')}{P('nav.brand','Brand kit','Brend to‘plami','Бренд-кит','brand.html')}</ul></div>
<div><h4>{T('ft.me','Me','Men','Я')}</h4><ul>{P('nav.about','About','Men haqimda','Обо мне','about.html')}{P('nav.contact','Contact','Aloqa','Контакты','contact.html')}{P('nav.me','Clive ID','Clive ID','Clive ID','me.html')}{P('nav.links','Links','Havolalar','Ссылки','links.html')}
<li><a href="{TG}" target="_blank" rel="noopener">Telegram</a></li><li><a href="{GH}" target="_blank" rel="noopener">GitHub</a></li></ul></div>
</div>
<div class="big" aria-hidden="true">Clive.</div>
<div class="bottom"><span>© <span data-year>2026</span> Imonqulov Baxriddin · Clive</span><span>{T('ft.made','Hand-built: plain HTML, CSS and JavaScript.','Qo‘lda qurilgan: oddiy HTML, CSS va JavaScript.','Сделано вручную: чистые HTML, CSS и JavaScript.')}</span></div>
</div></footer>'''

def page(slug, root, tkey, title_en, title_uz, title_ru, desc, body, css='', scripts=(), bare=False, extra_head=''):
    _reg(tkey, title_en, title_uz, title_ru)
    js = ''.join(f'<script src="{root}{s}"></script>' for s in scripts)
    navh = '' if bare else nav(slug, root)
    foot = '' if bare else footer(root)
    sh = '' if bare else sheet(root)
    return f'''<!DOCTYPE html>
<html lang="en" data-root="{root}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title_en)} · Clive</title>
<meta name="page-title-key" content="{tkey}">
<meta name="description" content="{esc(desc)}">
<meta name="theme-color" content="#070A18">
<meta property="og:type" content="website">
<meta property="og:title" content="{esc(title_en)} · Clive">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:image" content="{root}assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{root}favicon.svg" type="image/svg+xml">
<link rel="icon" href="{root}assets/img/icon-48.png" sizes="48x48" type="image/png">
<link rel="apple-touch-icon" href="{root}assets/img/icon-180.png">
<link rel="manifest" href="{root}site.webmanifest">
<link rel="alternate" type="application/rss+xml" title="Clive · Journal" href="{root}feed.xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS}">
<link rel="stylesheet" href="{root}assets/css/core.css">
{extra_head}<style>{css}</style>
<script>{EARLY}</script>
</head>
<body class="pg-{slug}">
<a class="skip" href="#main">{T('a.skip','Skip to content','Asosiy qismga o‘tish','К содержимому')}</a>
<div class="sky" aria-hidden="true"></div><div class="girih" aria-hidden="true"></div>
{sprite()}
{navh}
<main id="main">
{body}
</main>
{foot}
{sh}{drawer(root)}{cmdk()}<div class="scrim" id="scrim"></div>
<script src="{root}assets/js/i18n.js"></script>
<script src="{root}assets/js/core.js"></script>
{js}
</body>
</html>
'''

def sh(label_key, label, luz, lru, h_key, h, huz, hru, lead=None, center=False, icon='sparkle', tag='h2'):
    """section heading"""
    out = f'<div class="sh{" center" if center else ""}" data-reveal><span class="label">{ic(icon)}{T(label_key,label,luz,lru)}</span>{T(h_key,h,huz,hru,tag=tag)}'
    if lead:
        out += T(lead[0], lead[1], lead[2], lead[3], tag='p', cls='lead')
    return out + '</div>'

def i18n_js():
    uz = {k: v['uz'] for k, v in STR.items()}
    ru = {k: v['ru'] for k, v in STR.items()}
    en = {k: STR[k]['en'] for k in sorted(JS_KEYS)}
    return '/* generated: translations for the Clive site */\nwindow.I18N=' + json.dumps({'en': en, 'uz': uz, 'ru': ru}, ensure_ascii=False, separators=(',', ':')) + ';\n'
