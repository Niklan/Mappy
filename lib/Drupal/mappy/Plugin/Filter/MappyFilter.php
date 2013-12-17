<?php

/**
 * @file
 * Contains Drupal\mappy\Plugin\Filter.
 */

namespace Drupal\mappy\Plugin\Filter;

use Drupal\filter\Annotation\Filter;
use Drupal\Core\Annotation\Translation;
use Drupal\filter\Plugin\FilterBase;

/**
 * Provides a filter to display any HTML as plain text.
 *
 * @Filter(
 *   id = "fmappy_filter",
 *   module = "mappy",
 *   title = @Translation("Mappy filter"),
 *   type = FILTER_TYPE_TRANSFORM_IRREVERSIBLE,
 *   weight = 0
 * )
 */
class MappyFilter extends FilterBase {

  /**
   * {@inheritdoc}
   */
  public function process($text, $langcode, $cache, $cache_id) {
    // First, we find all mappy tokens.
    $pattern = "/\\[mappy(\\:(.+))?( .+)?\\]/isU";
    preg_match_all($pattern, $text, $matches);

    // In founded tokens, we get parameters.
    foreach ($matches[0] as $ci => $token) {
      drupal_set_message($token);
      // This is the real magic of Hogwarts. I spent totaly about 5-6 hours
      // to make this pattern work.
      preg_match_all("/(\\s)+(\\w+):(((\\s)*(\\w+))|(\\'(?:\\.|[^\\'\\\\])*\\'))/i", $token, $parameters);
      // And write parameters to an array.
      $att = array();
      foreach ($parameters['2'] as $key => $name) {
        // Additional, we remove quotes.
        $att[$parameters['2'][$key]] = str_replace("'", "", $parameters['3'][$key]);
      }

      // Now we generate HTML Mappy tag.
      // Which service are using. Google or Yandex.
      $service = $matches[2][$ci];
      // Generate attributes.
      $attributes = "";
      foreach ($att as $key => $value) {
        $attributes .= " {$key}=\"{$value}\"";
      }

      // And add all to tag.
      // Without '<mappy:' because drupal remove colons from tag.
      $tag = "<{$service} {$attributes}></{$service}>";

      // Replace token for tag.
      $text = str_replace($token, $tag, $text);
    }

    return $text;
  }


  /**
   * {@inheritdoc}
   */
  public function tips($long = FALSE) {
    return t("Every [mappy:service address:'address'] token will be replaced with map.");
  }

}