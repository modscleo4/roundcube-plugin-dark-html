<?php

class dark_html extends rcube_plugin
{
    private $rcube;

    public function init()
    {
        $this->rcube = rcube::get_instance();
        $this->add_texts('localization');

        $this->load_config();

        if ($this->is_enabled() && ($this->rcube->action == 'show' || $this->rcube->action == 'preview')) {
            $this->include_script('dark_html.js');
        }

        $this->add_hook('preferences_list', array($this, 'preferences_list'));
        $this->add_hook('preferences_save', array($this, 'preferences_save'));
    }

    function is_enabled()
    {
        $config = $this->rcube->config;
        return (bool)($config->get('dark_html_enabled', false));
    }

    function preferences_list($params)
    {
        if ($params['section'] == 'mailview') {
            $params['blocks']['main']['options']['rc_dark_html_enabled'] = [
                'title' => html::label('rc_dark_html_enabled', rcube::Q($this->gettext('dark_html_use'))),
                'content' => (new html_checkbox([
                    'name' => 'rc_dark_html_enabled',
                    'id' => 'rc_dark_html_enabled',
                    'value' => 1,
                ]))->show($this->rcube->config->get('dark_html_enabled', false))
            ];
        }

        return $params;
    }

    function preferences_save($params)
    {
        if ($params['section'] == 'mailview') {
            $params['prefs']['dark_html_enabled'] = isset($_POST['rc_dark_html_enabled']) ? true : false;
        }
        return $params;
    }
}
