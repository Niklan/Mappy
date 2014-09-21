<?php

/**
 * @file
 * Contains \Drupal\mappy\Form\MappySettingsForm.
 */

namespace Drupal\mappy\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

class MappySettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'mappy_admin_settings';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = \Drupal::config('mappy.settings');

    $form['google_maps'] = array(
      '#type' => 'fieldset',
      '#title' => t('Google Maps'),
      '#weight' => 1,
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
    );

    $form['google_maps']['mappy_google_width'] = array(
      '#type' => 'textfield',
      '#title' => t('Default width'),
      '#description' => t('Default width of the map. It is used when the parameter is not specified.'),
      '#default_value' => $config->get('google.width'),
      '#size' => 60,
      '#maxlength' => 128,
      '#required' => TRUE,
    );

    $form['google_maps']['mappy_google_height'] = array(
      '#type' => 'textfield',
      '#title' => t('Default height'),
      '#description' => t('Default height of the map. It is used when the parameter is not specified.'),
      '#default_value' => $config->get('google.height'),
      '#size' => 60,
      '#maxlength' => 128,
      '#required' => TRUE,
    );

    $form['yandex_maps'] = array(
      '#type' => 'fieldset',
      '#title' => t('Yandex Maps'),
      '#weight' => 1,
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
    );

    // Version list of Yandex.Maps.
    $yandex_verions = array(
      1 => '2.0 (old version)',
      2 => '2.1.x'
    );

    $form['yandex_maps']['mappy_yandex_version'] = array(
      '#type' => 'radios',
      '#title' => t('Version of Yandex.Map API'),
      '#default_value' => $config->get('yandex.version'),
      '#options' => $yandex_verions ,
      '#description' => t('You can choose, which version of Yandex.Maps will be used.'),
    );

    $form['yandex_maps']['mappy_yandex_width'] = array(
      '#type' => 'textfield',
      '#title' => t('Default width'),
      '#description' => t('Default width of the map. It is used when the parameter is not specified.'),
      '#default_value' => $config->get('yandex.width'),
      '#size' => 60,
      '#maxlength' => 128,
      '#required' => TRUE,
    );
    $form['yandex_maps']['mappy_yandex_height'] = array(
      '#type' => 'textfield',
      '#title' => t('Default height'),
      '#description' => t('Default height of the map. It is used when the parameter is not specified.'),
      '#default_value' => $config->get('yandex.height'),
      '#size' => 60,
      '#maxlength' => 128,
      '#required' => TRUE,
    );

    $form['loading_settings'] = array(
      '#type' => 'fieldset',
      '#title' => t('Mappy.js loading settings'),
      '#weight' => 1,
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
    );

    $match_type = array(
      0 => t('All pages except those listed'),
      1 => t('Only the listed pages'),
    );

    $form['loading_settings']['mappy_load_pages_match'] = array(
      '#type' => 'radios',
      '#title' => t('Attach Mappy.js on specific pages'),
      '#default_value' => $config->get('loading.type'),
      '#options' => $match_type,
    );

    $form['loading_settings']['mappy_load_pages_path'] = array(
      '#type' => 'textarea',
      '#description' => t("Specify pages by using their paths. Enter one path per line. The '*' character is a wildcard. Example paths are blog for the blog page and blog/* for every personal blog. &lt;front&gt; is the front page."),
      '#default_value' => $config->get('loading.paths'),
    );

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('mappy.settings')
      ->set('google.width', $form_state->getValue('mappy_google_width'))
      ->set('google.height', $form_state->getValue('mappy_google_height'))
      ->set('yandex.width', $form_state->getValue('mappy_yandex_width'))
      ->set('yandex.height', $form_state->getValue('mappy_yandex_height'))
      ->set('yandex.version', $form_state->getValue('mappy_yandex_version'))
      ->set('loading.type', $form_state->getValue('mappy_load_pages_match'))
      ->set('loading.paths', $form_state->getValue('mappy_load_pages_path'))
      ->save();

    parent::submitForm($form, $form_state);
  }
}
