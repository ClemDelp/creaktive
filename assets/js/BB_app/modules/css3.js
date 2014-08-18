/***************************************/
var CSS3GENERATOR = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    /*Init*/

  }
};
/***************************************/
CSS3GENERATOR.Views.Main = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.project = global.models.currentProject;
        this.template_generator = _.template($('#css3-generator-template').html());
    },
    events : {
      "click .saveTemplate" : "newTemplate"
    },
    newTemplate : function(e){
      e.preventDefault();
      var title = $(this.el).find("#text").val();
      var css = CSS3GENERATOR.render_styles();
      var css = css.replace('.btn {','').replace('}','');
      var template = {id:guid(),title:title,css:css};
      this.project.set({'templates':_.union(this.project.get('templates'),[template])}).save();
      $(this.el).before('<div data-alert class="alert-box tiny info radius">Template created !<a href="#" class="close">&times;</a></div>');
    },
    render : function(){
        $(this.el).empty();
        $(this.el).append(this.template_generator());
        return this;
    }
});
/***************************************/
// API

CSS3GENERATOR.styles = [];
CSS3GENERATOR.styles_markup = '';
CSS3GENERATOR.styles_hover_markup = '';
CSS3GENERATOR.pixel_properties = ['font-size', 'border-radius', 'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left'];
CSS3GENERATOR.gradient_properties = ['bg-start-gradient', 'bg-end-gradient'];
CSS3GENERATOR.input_focus = '';

/**
 * Initialize any DOM functionality (clicks, changes, etc..)
 */
CSS3GENERATOR.attach_handlers = function(){

  // accordion
  $('#settings-wrap .panel-wrap').click(function() {
    if(!$(this).hasClass('active')){
      $('.panel-wrap').removeClass('active');
      $('.accordion-inner').slideUp(200);
      $(this).addClass('active').next('.accordion-inner').slideDown(200);
    }
  });

  // more link
  $('.more-link').click(function(e){
    e.preventDefault();
    $(this).html() == 'More' ? $(this).html('Hide') : $(this).html('More');
    var section = $(this).attr('data-section');
    $('[data-section-more="' + section + '"]').slideToggle(200);
  });

  // settings input click
  $('#settings-wrap [data-control]').change(function(){
    CSS3GENERATOR.control_update($(this));
  });

  // settings display click
  $('#settings-wrap [data-control-display]').change(function(){
    CSS3GENERATOR.control_display_change($(this));
  });

  // apply a slider to any input with class "slider-bound"
  $('input.slider-bound').each(function(index) {
    // get input ID
    var inputId = $(this).attr('id');
    // get input value
    var inputValue = $(this).val();
    // get input max
    var inputMax = $(this).attr('max');
    $('#'+inputId+'-slider').slider({
      value: inputValue,
      max: inputMax,
      min: 0,
      slide: function(event, ui){
        $(this).prev().val(ui.value);
        CSS3GENERATOR.update_styles();
      }
    });
  });

  $('input, select').on('change keyup', function(){
    CSS3GENERATOR.update_styles();
    if($(this).hasClass('slider-bound')){
      $('#' + $(this).attr('id') + '-slider').slider('value', $(this).val());
    }
  });

  $('.color').focus(function(e) {
    CSS3GENERATOR.input_focus = $(this);
  });

  // open the color picker when the color preview is clicked
  $('.color-view').click(function(){
    CSS3GENERATOR.input_focus = $(this).prev();
    $(this).prev().ColorPickerShow();
  });

  // initialize the color picker
  $('.color').ColorPicker({
    onSubmit: function(hsb, hex, rgb, el){
      // hide the color picker
      $(el).ColorPickerHide();
      $(el).val('#'+hex);
    },
    onBeforeShow: function (){
      $(this).ColorPickerSetColor(this.value);
    },
    onChange: function(hsb, hex, rgb, el){
      // populate the input with the hex value
      CSS3GENERATOR.input_focus.val('#'+hex);
      // update the color preview
      CSS3GENERATOR.input_focus.next('.color-view').css('backgroundColor', '#'+hex);
      CSS3GENERATOR.update_styles();
    }
  });

  $('.btn').click(function(e){
    e.preventDefault();
  });

}

/**
 * Initialize (enable / disable) controls on load
 */
CSS3GENERATOR.initialize_controls = function(){
  $('#settings-wrap [data-control]').each(function(){
    CSS3GENERATOR.control_update($(this));
  });
  $('#settings-wrap [data-control-display]:checked').each(function(){
    CSS3GENERATOR.control_display_change($(this));
  });
  $('.color-view').each(function(){
    $(this).css('background-color', $(this).prev().val());
  });
}

/**
 * Change a control value (enable / disable controls)
 */
CSS3GENERATOR.control_update = function(el){
  var checked = el.is(':checked');
  var control = el.attr('data-control');

  // standard one-to-one controls
  $('[data-control-group="' + control + '"]').each(function(){
    checked ? CSS3GENERATOR.enable_control($(this)) : CSS3GENERATOR.disable_control($(this));
  });

  // group-switch controls
  $('[data-control-group-switch="' + control + '"]').each(function(){
    if(checked){
      CSS3GENERATOR.disable_control($(this));
    }else{
      $(this).find(':checkbox').each(function(){
        this.disabled = false;
      });
      $(this).removeClass('disabled').find('[data-control]').each(function(){
        CSS3GENERATOR.control_update($(this));
      });
    }
  });
}

/**
 * Change a control display (hide / show)
 */
CSS3GENERATOR.control_display_change = function(el){
  var control = el.attr('data-control-display');
  var display_selector = el.attr('name');
  $('[data-control-display-selector="' + display_selector + '"]').addClass('hidden').hide();
  $('[data-control-display-group="' + control + '"]').removeClass('hidden').show();
  CSS3GENERATOR.enable_control($('[data-control-display-group="' + control + '"]'));
  CSS3GENERATOR.disable_control($('[data-control-display-selector="' + display_selector + '"].hidden'));
}

/**
 * Disable all inputs and sliders in the element (el)
 */
CSS3GENERATOR.disable_control = function(el){
  el.addClass('disabled');
  el.find('.ui-slider').slider('disable');
  el.find('input, select').each(function(){
    this.disabled = true;
  });
}

/**
 * Enable all inputs and sliders in the element (el)
 */
CSS3GENERATOR.enable_control = function(el){
  el.removeClass('disabled');
  el.find('.ui-slider').slider('enable');
  el.find('input, select').each(function(){
    this.disabled = false;
  });
}

/**
 * Update the array that stores all css values
 */
CSS3GENERATOR.update_styles = function(){
  CSS3GENERATOR.prepare_styles();
  CSS3GENERATOR.generate_style_markup();
  CSS3GENERATOR.render_styles();
}

/**
 * Prepares the raw style data for css presentation (removes, combines, etc..)
 */
CSS3GENERATOR.prepare_styles = function(){
  CSS3GENERATOR.styles = {};
  CSS3GENERATOR.styles_markup = '';
  CSS3GENERATOR.styles_hover_markup = '';

  $('#settings-wrap').find('input[type="text"], select').not(':disabled').each(function(){
    var css_property = $(this).attr('id');
    CSS3GENERATOR.styles[css_property] = $(this).val();
  });

  // remove the text data
  $('.btn').html(CSS3GENERATOR.styles['text']);
  delete CSS3GENERATOR.styles['text'];

  // combine padding if all are present
  var padding_top, padding_right, padding_bottom, padding_left;
  if((padding_top = CSS3GENERATOR.styles['padding-top']) &&
     (padding_right = CSS3GENERATOR.styles['padding-right']) &&
     (padding_bottom = CSS3GENERATOR.styles['padding-bottom']) &&
     (padding_left = CSS3GENERATOR.styles['padding-left'])){
    CSS3GENERATOR.styles['padding'] = padding_top + 'px ' + padding_right + 'px ' + padding_bottom + 'px ' + padding_left;
    delete CSS3GENERATOR.styles['padding-top'];
    delete CSS3GENERATOR.styles['padding-right'];
    delete CSS3GENERATOR.styles['padding-bottom'];
    delete CSS3GENERATOR.styles['padding-left'];
  }

  // combine border styles
  var border_style, border_color, border_width;
  if((border_style = CSS3GENERATOR.styles['border-style']) &&
     (border_color = CSS3GENERATOR.styles['border-color']) &&
     (border_width = CSS3GENERATOR.styles['border-width'])){
    CSS3GENERATOR.styles['border'] = border_style + ' ' + border_color + ' ' + border_width + 'px';
    delete CSS3GENERATOR.styles['border-style'];
    delete CSS3GENERATOR.styles['border-color'];
    delete CSS3GENERATOR.styles['border-width'];
  }

  // combine border-top styles
  var border_top_style, border_top_color, border_top_width;
  if((border_top_style = CSS3GENERATOR.styles['border-top-style']) &&
     (border_top_color = CSS3GENERATOR.styles['border-top-color']) &&
     (border_top_width = CSS3GENERATOR.styles['border-top-width'])){
    CSS3GENERATOR.styles['border-top'] = border_top_style + ' ' + border_top_color + ' ' + border_top_width + 'px';
    delete CSS3GENERATOR.styles['border-top-style'];
    delete CSS3GENERATOR.styles['border-top-color'];
    delete CSS3GENERATOR.styles['border-top-width'];
  }

  // combine border-right styles
  var border_right_style, border_right_color, border_right_width;
  if((border_right_style = CSS3GENERATOR.styles['border-right-style']) &&
     (border_right_color = CSS3GENERATOR.styles['border-right-color']) &&
     (border_right_width = CSS3GENERATOR.styles['border-right-width'])){
    CSS3GENERATOR.styles['border-right'] = border_right_style + ' ' + border_right_color + ' ' + border_right_width + 'px';
    delete CSS3GENERATOR.styles['border-right-style'];
    delete CSS3GENERATOR.styles['border-right-color'];
    delete CSS3GENERATOR.styles['border-right-width'];
  }

  // combine border-bottom styles
  var border_bottom_style, border_bottom_color, border_bottom_width;
  if((border_bottom_style = CSS3GENERATOR.styles['border-bottom-style']) &&
     (border_bottom_color = CSS3GENERATOR.styles['border-bottom-color']) &&
     (border_bottom_width = CSS3GENERATOR.styles['border-bottom-width'])){
    CSS3GENERATOR.styles['border-bottom'] = border_bottom_style + ' ' + border_bottom_color + ' ' + border_bottom_width + 'px';
    delete CSS3GENERATOR.styles['border-bottom-style'];
    delete CSS3GENERATOR.styles['border-bottom-color'];
    delete CSS3GENERATOR.styles['border-bottom-width'];
  }

  // combine border-left styles
  var border_left_style, border_left_color, border_left_width;
  if((border_left_style = CSS3GENERATOR.styles['border-left-style']) &&
     (border_left_color = CSS3GENERATOR.styles['border-left-color']) &&
     (border_left_width = CSS3GENERATOR.styles['border-left-width'])){
    CSS3GENERATOR.styles['border-left'] = border_left_style + ' ' + border_left_color + ' ' + border_left_width + 'px';
    delete CSS3GENERATOR.styles['border-left-style'];
    delete CSS3GENERATOR.styles['border-left-color'];
    delete CSS3GENERATOR.styles['border-left-width'];
  }
}

/**
 * Populates the CSS3GENERATOR.styles_markup property with the renderable string
 */
CSS3GENERATOR.generate_style_markup = function(){

  // gradients
  var gradient_start, gradient_end;
  if((gradient_start = CSS3GENERATOR.styles['bg-start-gradient']) &&
     (gradient_end = CSS3GENERATOR.styles['bg-end-gradient'])){
    CSS3GENERATOR.styles_markup += CSS3GENERATOR.render_style_line('background', gradient_start);
    CSS3GENERATOR.styles_markup += CSS3GENERATOR.render_style_line('background-image', '-webkit-linear-gradient(top, ' + gradient_start + ', ' + gradient_end + ')');
    CSS3GENERATOR.styles_markup += CSS3GENERATOR.render_style_line('background-image', '-moz-linear-gradient(top, ' + gradient_start + ', ' + gradient_end + ')');
    CSS3GENERATOR.styles_markup += CSS3GENERATOR.render_style_line('background-image', '-ms-linear-gradient(top, ' + gradient_start + ', ' + gradient_end + ')');
    CSS3GENERATOR.styles_markup += CSS3GENERATOR.render_style_line('background-image', '-o-linear-gradient(top, ' + gradient_start + ', ' + gradient_end + ')');
    CSS3GENERATOR.styles_markup += CSS3GENERATOR.render_style_line('background-image', 'linear-gradient(to bottom, ' + gradient_start + ', ' + gradient_end + ')');
    delete CSS3GENERATOR.styles['bg-start-gradient'];
    delete CSS3GENERATOR.styles['bg-end-gradient'];
    delete CSS3GENERATOR.styles['bg-color'];
  }

  // gradient hovers
  var gradient_hover_start, gradient_hover_end;
  if((gradient_hover_start = CSS3GENERATOR.styles['bg-start-gradient-hover']) &&
     (gradient_hover_end = CSS3GENERATOR.styles['bg-end-gradient-hover'])){
    CSS3GENERATOR.styles_hover_markup += CSS3GENERATOR.render_style_line('background', gradient_hover_start);
    CSS3GENERATOR.styles_hover_markup += CSS3GENERATOR.render_style_line('background-image', '-webkit-linear-gradient(top, ' + gradient_hover_start + ', ' + gradient_hover_end + ')');
    CSS3GENERATOR.styles_hover_markup += CSS3GENERATOR.render_style_line('background-image', '-moz-linear-gradient(top, ' + gradient_hover_start + ', ' + gradient_hover_end + ')');
    CSS3GENERATOR.styles_hover_markup += CSS3GENERATOR.render_style_line('background-image', '-ms-linear-gradient(top, ' + gradient_hover_start + ', ' + gradient_hover_end + ')');
    CSS3GENERATOR.styles_hover_markup += CSS3GENERATOR.render_style_line('background-image', '-o-linear-gradient(top, ' + gradient_hover_start + ', ' + gradient_hover_end + ')');
    CSS3GENERATOR.styles_hover_markup += CSS3GENERATOR.render_style_line('background-image', 'linear-gradient(to bottom, ' + gradient_hover_start + ', ' + gradient_hover_end + ')');
    delete CSS3GENERATOR.styles['bg-start-gradient-hover'];
    delete CSS3GENERATOR.styles['bg-end-gradient-hover'];
    delete CSS3GENERATOR.styles['background-hover'];
  }

  // border radius
  var border_radius;
  if((border_radius = CSS3GENERATOR.styles['border-radius'])){
    CSS3GENERATOR.styles_markup += CSS3GENERATOR.render_style_line('-webkit-border-radius', border_radius);
    CSS3GENERATOR.styles_markup += CSS3GENERATOR.render_style_line('-moz-border-radius', border_radius);
    CSS3GENERATOR.styles_markup += CSS3GENERATOR.render_style_line('border-radius', border_radius);
    delete CSS3GENERATOR.styles['border-radius'];
  }

  // text shadow
  var text_shadow_color, text_shadow_x, text_shadow_y, text_shadow_blur;
  if((text_shadow_color = CSS3GENERATOR.styles['text-shadow-color']) &&
     (text_shadow_x = CSS3GENERATOR.styles['text-shadow-x']) &&
     (text_shadow_y = CSS3GENERATOR.styles['text-shadow-y']) &&
     (text_shadow_blur = CSS3GENERATOR.styles['text-shadow-blur'])){
    CSS3GENERATOR.styles_markup += CSS3GENERATOR.render_style_line('text-shadow', text_shadow_x + 'px ' + text_shadow_y + 'px ' + text_shadow_blur + 'px ' + text_shadow_color);
    delete CSS3GENERATOR.styles['text-shadow-color'];
    delete CSS3GENERATOR.styles['text-shadow-x'];
    delete CSS3GENERATOR.styles['text-shadow-y'];
    delete CSS3GENERATOR.styles['text-shadow-blur'];
  }

  // box shadow
  var box_shadow_color, box_shadow_x, box_shadow_y, box_shadow_blur;
  if((box_shadow_color = CSS3GENERATOR.styles['box-shadow-color']) &&
     (box_shadow_x = CSS3GENERATOR.styles['box-shadow-x']) &&
     (box_shadow_y = CSS3GENERATOR.styles['box-shadow-y']) &&
     (box_shadow_blur = CSS3GENERATOR.styles['box-shadow-blur'])){
    CSS3GENERATOR.styles_markup += CSS3GENERATOR.render_style_line('-webkit-box-shadow', box_shadow_x + 'px ' + box_shadow_y + 'px ' + box_shadow_blur + 'px ' + box_shadow_color);
    CSS3GENERATOR.styles_markup += CSS3GENERATOR.render_style_line('-moz-box-shadow', box_shadow_x + 'px ' + box_shadow_y + 'px ' + box_shadow_blur + 'px ' + box_shadow_color);
    CSS3GENERATOR.styles_markup += CSS3GENERATOR.render_style_line('box-shadow', box_shadow_x + 'px ' + box_shadow_y + 'px ' + box_shadow_blur + 'px ' + box_shadow_color);
    delete CSS3GENERATOR.styles['box-shadow-color'];
    delete CSS3GENERATOR.styles['box-shadow-x'];
    delete CSS3GENERATOR.styles['box-shadow-y'];
    delete CSS3GENERATOR.styles['box-shadow-blur'];
  }

  $.each(CSS3GENERATOR.styles, function(css_property, css_value){
    // check if "px" should appended to the style
    var px_value = $.inArray(css_property, CSS3GENERATOR.pixel_properties) > -1 ? 'px' : '';
    var tab = '&nbsp;&nbsp;';

    // handle the hover background
    if(css_property == 'background-hover'){
      CSS3GENERATOR.styles_hover_markup = CSS3GENERATOR.render_style_line('background', css_value);
    }else{
      CSS3GENERATOR.styles_markup += CSS3GENERATOR.render_style_line(css_property, css_value);
    }
  });

  // remove text-decoration
  CSS3GENERATOR.styles_markup += CSS3GENERATOR.render_style_line('text-decoration', 'none');

  // wrap the style markups in proper css calls
  //CSS3GENERATOR.styles_markup = '.btn {\n' + CSS3GENERATOR.styles_markup + '}';
  CSS3GENERATOR.styles_markup = '.btn {\n' + CSS3GENERATOR.styles_markup + '}';
  CSS3GENERATOR.styles_hover_markup += CSS3GENERATOR.render_style_line('text-decoration', 'none');
  CSS3GENERATOR.styles_hover_markup = '\n\n.btn:hover {\n' + CSS3GENERATOR.styles_hover_markup + '}';
}

/**
 * Update the output of the css styles
 */
CSS3GENERATOR.render_styles = function(){
  var output = CSS3GENERATOR.styles_markup + CSS3GENERATOR.styles_hover_markup;
  var style_tag = '<style id="dynamic-styles" type="text/css">' + output + '</style>';
  $('#dynamic-styles').replaceWith(style_tag);
  $('#css-display').html('<pre>' + output + '</pre>');
  return CSS3GENERATOR.styles_markup;
}

/**
 * Renders an individual style line
 */
CSS3GENERATOR.render_style_line = function(css_property, css_value){
  // check if "px" should appended to the style
  var px_value = $.inArray(css_property, CSS3GENERATOR.pixel_properties) > -1 ? 'px' : '';
  var tab = '  ';
  return tab + css_property + ': ' + css_value + px_value + ';\n';
}