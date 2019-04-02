$(document).ready(function () {    var width = $('#container').width();    var height;    var imageObj = new Image();    var stage;    imageObj.onload = function () {        height = width * imageObj.height / imageObj.width;        windowHeight = $(window).height() * 0.85;        if (height > windowHeight) {            height = windowHeight;            width = height * imageObj.width / imageObj.height;        }        var yoda = new Konva.Image({            x: 0,            y: 0,            image: imageObj,            width: width,            height: height        });        stage = new Konva.Stage({            container: 'container',            width: width,            height: height        });        var layer = new Konva.Layer();        // add the shape to the layer        layer.add(yoda);        // add the layer to the stage        stage.add(layer);    };    imageObj.src = 'https://s3.amazonaws.com/ece1779projecta3bucket/images/' + $('#image-box').data("id");    var globalData = {};    var layers = {};    drawBox = function (type, index) {        layer = layers[type][index];        if (layer) {            layer.destroy();            layers[type][index] = null;        } else {            data = globalData[type][index];            if (type === 'faceDetails') {                color = '#FFE5B4';                boxes = [{BoundingBox: data['BoundingBox']}];            }            else {                color = '#488AC7';                boxes = data['Instances'];            }            layer = new Konva.Layer();            boxes.forEach(function (box) {                var rect = new Konva.Rect({                    x: box['BoundingBox']['Left'] * width,                    y: box['BoundingBox']['Top'] * height,                    width: box['BoundingBox']['Width'] * width,                    height: box['BoundingBox']['Height'] * height,                    stroke: color,                    strokeWidth: 2                });                layer.add(rect);            });            stage.add(layer);            layers[type][index] = layer;        }    };    getButtonText = function (name, data) {        if (name === 'faceDetails')            return data['Gender']['Value'] + ',  ' + data['AgeRange']['Low'] + ' - ' + data['AgeRange']['High'];        else            return data['Name'];    };    getButtonStyle = function (name) {        if (name === 'faceDetails')            return 'success';        else            return 'primary';    };    function button(text, type, index) {        return '<button class="btn btn-outline-' + getButtonStyle(type) + ' btn-sm btn-block" onclick="drawBox(\'' + type + '\'\,' + index + ')">' + text + '</button>'    }    dataArray = ['faceDetails', 'labels', 'celebrityFaces'];    $.ajax({        url: 'https://s3.amazonaws.com/ece1779projecta3bucket/faceDetails/' + $('#image-box').data("id") + '.json',        success: function (data) {            data = JSON.parse(data)['faceDetails'];            globalData['faceDetails'] = data;            layers['faceDetails'] = [];            data.forEach(function (face, index) {                var template = $('#template-faceDetails').children(":first").clone();                template.find('.gender').text(face['Gender']['Value']);                template.find('.age').text(face['AgeRange']['Low'] + ' - ' + face['AgeRange']['High']);                template.find('.card').attr('onclick', 'drawBox(\'faceDetails\',' + index + ')');                layers['faceDetails'].push(null);                $('#block-faceDetails').append(template);            });            if (data.length < 1) {                $('#notice-faceDetails').show();            }        }    });    $.ajax({        url: 'https://s3.amazonaws.com/ece1779projecta3bucket/labels/' + $('#image-box').data("id") + '.json',        success: function (data) {            data = JSON.parse(data)['labels'];            globalData['labels'] = data;            layers['labels'] = [];            data.forEach(function (label, index) {                var template = $('#template-labels').children(":first").clone();                template.find('.draw-click').text(label['Name']);                template.find('.draw-click').attr('onclick', 'drawBox(\'labels\',' + index + ')');                template.find('.search').attr('href', '/?text=' + label['Name']);                if (label['Instances'].length > 0)                    template.find('.draw-click').css('color', '#488AC7');                $('#block-labels').append(template);            })            if (data.length < 1) {                $('#notice-labels').show();            }        }    });    $.ajax({        url: 'https://s3.amazonaws.com/ece1779projecta3bucket/celebrityFaces/' + $('#image-box').data("id") + '.json',        success: function (data) {            data = JSON.parse(data)['celebrityFaces'];            globalData['celebrityFaces'] = data;            layers['celebrityFaces'] = [];            data.forEach(function (celebrity, index) {                var template = $('#template-celebrityFaces').children(":first").clone();                template.find('a').text(celebrity['Name']);                if (celebrity['Urls'].length > 0)                    template.find('a').attr('href', 'http://' + celebrity['Urls'][0]);                $('#block-celebrityFaces').append(template);            });            if (data.length < 1) {                $('#notice-celebrityFaces').show();            }        }    });});