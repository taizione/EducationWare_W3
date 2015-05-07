var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');
var Record = require('../models/record.js');
var i18n=require('i18n');
var path = require('path');
var soap = require('soap');

var locale;
i18n.configure({
  locales: ['en', 'zh-tw', 'zh-cn'],
  directory: path.normalize(__dirname + '/../locales')
}); 

module.exports = function(app) {
  app.get('/', function(req, res) {
    var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
    console.log("locale:"+locale);
    i18n.init(req, res);
    req.setLocale(locale);
    Record.calculateTimes(function(err, records) {
      if (err) {
        records = [];
      }
      console.log(records);
      // res.render('index', {
      //   title: res.__('EW0001'),
      //   records: records,
      // });
      res.redirect('/onlineCourse');
    });
  });
    app.get('/onlineCourse', function(req, res) {
    var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
    console.log("locale:"+locale);
    i18n.init(req, res);
    req.setLocale(locale);
    Record.calculateTimes(function(err, records) {
      if (err) {
        records = [];
      }
      console.log(records);
      res.render('onlineCourse', {
        title: res.__('EW0001'),
        records: records,
      });
    });
  });
    app.get('/session2014', function(req, res) {
    var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
    console.log("locale:"+locale);
    i18n.init(req, res);
    req.setLocale(locale);
    Record.calculateTimes(function(err, records) {
      if (err) {
        records = [];
      }
      console.log(records);
      res.render('session2014', {
        title: res.__('EW0001'),
        records: records,
      });
    });
  });
    app.get('/session2015', function(req, res) {
    var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
    console.log("locale:"+locale);
    i18n.init(req, res);
    req.setLocale(locale);
    Record.calculateTimes(function(err, records) {
      if (err) {
        records = [];
      }
      console.log(records);
      res.render('session2015', {
        title: res.__('EW0001'),
        records: records,
      });
    });
  });

  
  app.get('/login', checkNotLogin);
  app.get('/login', function(req, res) {
        var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
        i18n.init(req, res);
    req.setLocale(locale);
    res.render('login', {
      title: res.__('EW0002'),
      layout: null,
    });
  }); 
  
  app.post('/login', checkNotLogin);
  app.post('/login', function(req, res) {
        var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
            i18n.init(req, res);
    req.setLocale(locale);
    var url= "http://localhost:8080/axis2/services/BPLoginHandler?wsdl";
    var args={  emailAddr: req.body.username,
                password: req.body.password};
    soap.createClient(url, function(err, client) {
     // console.log(args);
    client.auth(args, function(err, result) {
    console.log(result.return);
      if(result.return==0)
      {
        //check whether user exist.
        var username=req.body.username;
        console.log(username);
        var newUser=new User({username:req.body.username,times:1});
        console.log("newUser:"+newUser.username);
    
        // var usertemp;
        User.get(username,function(err,user){
          // usertemp=user;});
        // console.log(usertemp);
          if(!user)
          {
         newUser.save(function(err){
              if(err){
                req.flash('error',err);
              }
              user={username:username,
                    times:1};

           
                req.session.user=user;
                 req.session.times=1;
                       console.log("000001111");
                   res.send("0");
        req.flash('success', res.__('EW0039'));
        res.redirect('/onlineCourse');
         });
          }
          else
          {
            console.log("update");
            newUser.update(function(err) {
                if (err) {
                  req.flash('error', err);
                  }
            console.log(user);
            req.session.user=user;
            console.log(user.times+user.username+"00000");
     //res.send(400,'this is a error');
      // res.json({success:1});
      // // var aa="1";
         // res.end(200);
      //   // req.flash('success', res.__('EW0039'));
        res.redirect('/onlineCourse');
          });
          }

   
          
         });

      }
      else if (result.return==6){
        req.flash('error', res.__('EW0036'));
        return res.redirect('/login');          
      }
      else if (result.return==9){
        req.flash('error', res.__('EW0037'));
        return res.redirect('/login');          
        }
              else {
        req.flash('error', res.__('EW0038'));
        return res.redirect('/login');          
        }

     
    });
   });
  });

  app.get('/educationHome', checkLogin);
  app.get('/educationHome',function(req, res) {
        var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
     i18n.init(req, res);
    req.setLocale(locale);
    Record.calculateTimes(function(err, records) {
      if (err) {
        records = [];
      }

      res.render('educationhome', {
        title: res.__('EW0041'),
        records: records,
        });
      });
  });

  app.get('/gvtEducation', checkLogin);
   app.get('/gvtEducation',function(req, res) {
        var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
            i18n.init(req, res);
    req.setLocale(locale);

      res.render('gvtEducation', {
        title:  res.__('EW0041'),
        coursetype:"gvtEducation",
        videosource: 'GVT_Education.mp4',
        videoicon:'GVT.jpg',
        filetype:'video',

    });
  });

  app.get('/tvtProcess', checkLogin);
      app.get('/tvtProcess',function(req, res) {
            var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
                i18n.init(req, res);
    req.setLocale(locale);

      res.render('tvtProcess', {
        title:  res.__('EW0041'),
        coursetype:"tvtProcess",
        videosource: 'TVT Process.mp4',
        videoicon:'tvtProcess.jpg',
         filetype:'video',
 
      });  
  });

  app.get('/uaTools', checkLogin);
  app.get('/uaTools',function(req, res) {
        var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
            i18n.init(req, res);
    req.setLocale(locale);

              res.render('uaTools', {
              title:  res.__('EW0041'),
              coursetype:"uaTools",
              videosource: 'UA tool demo update.mp4',
              videoicon:'UATools.jpg',
               filetype:'video',

      });
  });

  app.get('/tips_for_better_doing_tvt_go_nogo_accessment', checkLogin);
    app.get('/tips_for_better_doing_tvt_go_nogo_accessment',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);

                res.render('tips_for_better_doing_tvt_go_nogo_accessment', {
                  title:  res.__('EW0041'),
                  coursetype:"tips_for_better_doing_tvt_go_nogo_accessment",
                  videosource: '0627_TVT_GO-NOGO_Assessment_Education.flv',
                  videoicon:'0627_TVT_GO-NOGO_Assessment_Education.jpg',
                   filetype:'video',

                });
  });

  app.get('/gvt_ta_example_sharing', checkLogin);
    app.get('/gvt_ta_example_sharing',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);

                res.render('gvt_ta_example_sharing', {
                  title:  res.__('EW0041'),
                  coursetype:"gvt_ta_example_sharing",
                  videosource: '0627_GVT_TestArea_Example_Sharing.flv',
                  videoicon:'0627_GVT_TestArea_Example_Sharing.jpg',
                   filetype:'video',
  
                });
  });
  app.get('/speed_kpi_definition_and_gso_project_data_collection', checkLogin);
    app.get('/speed_kpi_definition_and_gso_project_data_collection',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('speed_kpi_definition_and_gso_project_data_collection', {
                  title:  res.__('EW0041'),
                  coursetype:"speed_kpi_definition_and_gso_project_data_collection",
                  videosource: '2014_KPI_Speed_definition_and_GSO_Project_Data_Collection.flv',
                  videoicon:'2014_KPI_Speed_definition_and_GSO_Project_Data_Collection.jpg',
                   filetype:'video',

                  
                  });
             
  });
  app.get('/defect_creation_tips', checkLogin);
    app.get('/defect_creation_tips',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('defect_creation_tips', {
                  title:  res.__('EW0041'),
                  coursetype:"defect_creation_tips",
                  videosource: 'GSSC_Defect_Creation_Tips.flv',
                  videoicon:'GSSC_Defect_Creation_Tips.jpg',
                   filetype:'video',

                });
  });

  app.get('/demo_testcase_creation_tool ', checkLogin);
    app.get('/demo_testcase_creation_tool',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);

                res.render('demo_testcase_creation_tool', {
                  title:  res.__('EW0041'),
                  coursetype:"demo_testcase_creation_tool",
                  videosource: 'Demo_TestCaseCreationTool.flv',
                  videoicon:'Demo_TestCaseCreationTool.jpg',
                   filetype:'video',

                });
  });

      app.get('/dbs_enhancements', checkLogin);
    app.get('/dbs_enhancements',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('dbs_enhancements', {
                  title:  res.__('EW0041'),
                  coursetype:"dbs_enhancements",
                  videosource: '0725_2014_1H_DBs_Enhancements.mp3',
                  videoicon:'0725_2014_1H_DBs_Enhancements.jpg',
                   filetype:'audio',

                });
  });

      app.get('/gvt_in_cd_Process', checkLogin);
    app.get('/gvt_in_cd_Process',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('gvt_in_cd_Process', {
                  title:  res.__('EW0041'),
                  coursetype:"gvt_in_cd_Process",
                  videosource: '0725_GVT_in_CD_Process.mp3',
                  videoicon:'0725_GVT_in_CD_Process.jpg',
                   filetype:'audio',

                });
  });

          app.get('/gb18030', checkLogin);
    app.get('/gb18030',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('gb18030', {
                  title:  res.__('EW0041'),
                  coursetype:"gb18030",
                  videosource: 'gb18030.mp3',
                  videoicon:'gb18030.jpg',
                   filetype:'audio',

               
                });
  });

          app.get('/how_to_write_wellconveived_technical_documentation', checkLogin);
    app.get('/how_to_write_wellconveived_technical_documentation',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('how_to_write_wellconveived_technical_documentation', {
                  title:  res.__('EW0041'),
                  coursetype:"how_to_write_wellconveived_technical_documentation",
                  videosource: 'how_to_write_wellconveived_technical_documentation.mp3',
                  videoicon:'how_to_write_wellconveived_technical_documentation.jpg',
                   filetype:'audio',

                });
  });

              app.get('/translation_qality_process', checkLogin);
    app.get('/translation_qality_process',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('translation_qality_process', {
                  title:  res.__('EW0041'),
                  coursetype:"translation_qality_process",
                  videosource: 'translation_qality_process.flv',
                  videoicon:'translation_qality_process.jpg',
                   filetype:'video',
                  

                });
  });

              app.get('/sniff_gvt_for_bluemix', checkLogin);
    app.get('/sniff_gvt_for_bluemix',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('sniff_gvt_for_bluemix', {
                  title:  res.__('EW0041'),
                  coursetype:"sniff_gvt_for_bluemix",
                  videosource: 'sniff_gvt_for_bluemix.flv',
                  videoicon:'sniff_gvt_for_bluemix.jpg',
                   filetype:'video',

                });
  });

                  app.get('/gb18030_compliance_test', checkLogin);
    app.get('/gb18030_compliance_test',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('gb18030_compliance_test', {
                  title:  res.__('EW0041'),
                  coursetype:"gb18030_compliance_test",
                  videosource: 'gb18030_compliance_test.flv',
                  videoicon:'gb18030_compliance_test.jpg',
                   filetype:'video',

                });
  });
                      app.get('/2014_taiwan_technical_leadership_exchange', checkLogin);
    app.get('/2014_taiwan_technical_leadership_exchange',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('2014_taiwan_technical_leadership_exchange', {
                  title:  res.__('EW0041'),
                  coursetype:"2014_taiwan_technical_leadership_exchange",
                  videosource: '2014_taiwan_technical_leadership_exchange.mp3',
                  videoicon:'2014_taiwan_technical_leadership_exchange.jpg',
                   filetype:'audio',

                });
  });

                          app.get('/g11n_tools_awards_and_ram_introduction', checkLogin);
    app.get('/g11n_tools_awards_and_ram_introduction',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('g11n_tools_awards_and_ram_introduction', {
                  title:  res.__('EW0041'),
                  coursetype:"g11n_tools_awards_and_ram_introduction",
                  videosource: 'g11n_tools_awards_and_ram_introduction.mp3',
                  videoicon:'g11n_tools_awards_and_ram_introduction.jpg',
                   filetype:'audio',

                });
  });

                              app.get('/gbms_dou_tool_education_for_gssc', checkLogin);
    app.get('/gbms_dou_tool_education_for_gssc',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('gbms_dou_tool_education_for_gssc', {
                  title:  res.__('EW0041'),
                  coursetype:"gbms_dou_tool_education_for_gssc",
                  videosource: 'gbms_dou_tool_education_for_gssc.flv',
                  videoicon:'gbms_dou_tool_education_for_gssc.jpg',
                   filetype:'video',

                });
  });

                                  app.get('/workshopopening', checkLogin);
    app.get('/workshopopening',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('workshopopening', {
                  title:  res.__('EW0041'),
                  coursetype:"workshopopening",
                  videosource: 'workshopopening.mp3',
                  videoicon:'workshopopening.jpg',
                   filetype:'audio',

                });
  });

                                      app.get('/srat_session_1', checkLogin);
    app.get('/srat_session_1',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('srat_session_1', {
                  title:  res.__('EW0041'),
                  coursetype:"srat_session_1",
                  videosource: 'srat_session_1.flv',
                  videoicon:'srat_session_1.jpg',
                   filetype:'video',

                });
  });

  app.get('/bluemix_demo', checkLogin);
    app.get('/bluemix_demo',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('bluemix_demo', {
                  title:  res.__('EW0041'),
                  coursetype:"bluemix_demo",
                  videosource: 'bluemix_demo.mp4',
                  videoicon:'bluemix_demo.jpg',
                   filetype:'video',

                });
  });

      app.get('/bidi_testing_in_gvt', checkLogin);
    app.get('/bidi_testing_in_gvt',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('bidi_testing_in_gvt', {
                  title:  res.__('EW0041'),
                  coursetype:"bidi_testing_in_gvt",
                  videosource: 'bidi_testing_in_gvt.flv',
                  videoicon:'bidi_testing_in_gvt.jpg',
                   filetype:'video',

                });
  });

          app.get('/project_control_and_support_center', checkLogin);
    app.get('/project_control_and_support_center',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('project_control_and_support_center', {
                  title:  res.__('EW0041'),
                  coursetype:"project_control_and_support_center",
                  videosource: 'project_control_and_support_center.flv',
                  videoicon:'project_control_and_support_center.jpg',
                   filetype:'video',

                });
  });

              app.get('/pm3e', checkLogin);
    app.get('/pm3e',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('pm3e', {
                  title:  res.__('EW0041'),
                  coursetype:"pm3e",
                  videosource: 'pm3e.flv',
                  videoicon:'pm3e.jpg',
                   filetype:'video',

                });
  });

    app.get('/1t1p_translation_tool', checkLogin);
    app.get('/1t1p_translation_tool',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('1t1p_translation_tool', {
                  title:  res.__('EW0041'),
                  coursetype:"1t1p_translation_tool",
                  videosource: '1t1p_translation_tool.flv',
                  videoicon:'1t1p_translation_tool.jpg',
                   filetype:'video',

                });
  });

        app.get('/mtp_cfm_team_sharing', checkLogin);
    app.get('/mtp_cfm_team_sharing',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('mtp_cfm_team_sharing', {
                  title:  res.__('EW0041'),
                  coursetype:"mtp_cfm_team_sharing",
                  videosource: 'mtp_cfm_team_sharing.mp3',
                  videoicon:'mtp_cfm_team_sharing.jpg',
                   filetype:'radio',

                });
  });

            app.get('/open_tm2', checkLogin);
    app.get('/open_tm2',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('open_tm2', {
                  title:  res.__('EW0041'),
                  coursetype:"open_tm2",
                  videosource: 'open_tm2.mp3',
                  videoicon:'open_tm2.jpg',
                   filetype:'radio',

                });
  });

           app.get('/lotus_auntomator', checkLogin);
    app.get('/lotus_auntomator',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('lotus_auntomator', {
                  title:  res.__('EW0041'),
                  coursetype:"lotus_auntomator",
                  videosource: 'lotus_auntomator.flv',
                  videoicon:'lotus_auntomator.jpg',
                   filetype:'video',

                });
  });

               app.get('/rft_java', checkLogin);
    app.get('/rft_java',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('rft_java', {
                  title:  res.__('EW0041'),
                  coursetype:"rft_java",
                  videosource: 'rft_java.mp3',
                  videoicon:'rft_java.jpg',
                   filetype:'radio',

                });
  });

      app.get('/rft_python', checkLogin);
    app.get('/rft_python',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('rft_python', {
                  title:  res.__('EW0041'),
                  coursetype:"rft_python",
                  videosource: 'rft_python.flv',
                  videoicon:'rft_python.jpg',
                   filetype:'video',

                });
  });

      app.get('/rft_advanced_techniques', checkLogin);
    app.get('/rft_advanced_techniques',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('rft_advanced_techniques', {
                  title:  res.__('EW0041'),
                  coursetype:"rft_advanced_techniques",
                  videosource: 'rft_advanced_techniques.flv',
                  videoicon:'rft_advanced_techniques.jpg',
                   filetype:'video',

                });
  });

        app.get('/tools_workshop_opening', checkLogin);
    app.get('/tools_workshop_opening',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('tools_workshop_opening', {
                  title:  res.__('EW0041'),
                  coursetype:"tools_workshop_opening",
                  videosource: 'tools_workshop_opening.flv',
                  videoicon:'tools_workshop_opening.jpg',
                   filetype:'video',

                });
  });

     app.get('/tools_workshop_01', checkLogin);
    app.get('/tools_workshop_01',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('tools_workshop_01', {
                  title:  res.__('EW0041'),
                  coursetype:"tools_workshop_01",
                  videosource: 'tools_workshop_01.flv',
                  videoicon:'tools_workshop_01.jpg',
                   filetype:'video',

                });
  });

     app.get('/tools_workshop_02', checkLogin);
    app.get('/tools_workshop_02',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('tools_workshop_02', {
                  title:  res.__('EW0041'),
                  coursetype:"tools_workshop_02",
                  videosource: 'tools_workshop_02.flv',
                  videoicon:'tools_workshop_02.jpg',
                   filetype:'video',

                });
  });

    app.get('/continuous_delivery_of_translations', checkLogin);
    app.get('/continuous_delivery_of_translations',function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);


                res.render('continuous_delivery_of_translations', {
                  title:  res.__('EW0041'),
                  coursetype:"continuous_delivery_of_translations",
                  videosource: 'continuous_delivery_of_translations.mp4',
                  videoicon:'continuous_delivery_of_translations.jpg',
                   filetype:'video',

                });
  });




  app.get('/logout', checkLogin);
  app.get('/logout', function(req, res) {
        var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
            i18n.init(req, res);
    req.setLocale(locale);
    req.session.user = null;
    req.flash('success',  res.__('EW0040'));
    res.redirect('/');
  });
 
  
  app.get('/record',function(req, res){
        var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
            i18n.init(req, res);
    req.setLocale(locale);

  var coursename=req.query.coursename;
  var currentUser = req.session.user;
  console.log(coursename+ "abc"+currentUser.username);
    Record.get(currentUser.username,coursename,function(error,result){

      var record = new Record(currentUser.username, coursename);

      if(!result)
        {
          console.log("save");
          record.save(function(err) {
                if (err) {
                  req.flash('error', err);
                  return res.redirect('/');
                }
                // req.flash('success', '记录成功');
                res.redirect('/u/' + currentUser.username);
              });
       }
       else{
          console.log("update");
        record.update(function(err) {
                if (err) {
                  req.flash('error', err);
                  return res.redirect('/');
                }
                // req.flash('success', '更新成功');
                console.log("update success");
                res.redirect('/u/' + currentUser.username);
              });
       }
    })
 });

  app.get('/contactUS', function(req, res) {
        var locales=req.headers['accept-language'].split(",");
    locale=locales[0];

            i18n.init(req, res);
    req.setLocale(locale);
      res.render('contactUS', {
        title:  res.__('EW0001'),

    });
  });
  app.get('/profile', checkLogin);
    app.get('/profile', function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);

  // var url= "http://localhost:8080/axis2/services/BPLoginHandler?wsdl";
  //     var args={  emailAddr: req.session.user.username};
  //   soap.createClient(url, function(err, client) {
  //   console.log(req.session.user.username);
  //   client.getProfile(args, function(err, result) {
  //       console.log(result);
  //    var results=result.return.split(",");
  //     var info={  MGR: results[1],
  //                 NOTEID:results[3],
  //                 JOBRESPONSIB:results[5],
  //                 COUNTRY:results[7],
  //                 NAME:results[9]+""+results[10],
  //                 XPHONE:results[12],
  //                 CNUM:results[14].substring(0,6)};

    var currentUser = req.session.user;

        Record.list(currentUser.username, function(err, profileResults) {
          if (err) {
            profileResults = [];
          }
          console.log("profileResults"+profileResults);
          res.render('profile', {
            title: res.__('EW0001'),
            profileResults:profileResults,
          });
      });

  // });
    // });

  
  });
  app.get('/studyRecord', checkLogin);
    app.get('/studyRecord', function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
              i18n.init(req, res);
    req.setLocale(locale);

  

        var currentUser = req.session.user;
        Record.list(currentUser.emailAddr, function(err, profileResults) {
          if (err) {
            profileResults = [];
          }
          console.log("profileResults"+profileResults);
          res.render('profile', {
            title: res.__('EW0001'),
            profileResults:profileResults,
            layout:'infolayout',
          });
      });
  });

  app.get('/onlineCourse', function(req, res) {
        var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
            i18n.init(req, res);
    req.setLocale(locale);
    console.log(locale);
      res.render('onlineCourse', {
        title: res.__('EW0001'),
    
      });
  });


  app.get('/versionRecord', function(req, res) {
        var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
            i18n.init(req, res);
    req.setLocale(locale);
    console.log(locale);
      res.render('versionRecord', {
        title: res.__('EW0001'),

      });
  });
    app.get('/aboutUs', function(req, res) {
          var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
                i18n.init(req, res);
    req.setLocale(locale);
      res.render('aboutUS', {
        title: res.__('EW0001'),
       
      });
  });
  
  
  app.post('/postIdea', checkLogin);
  app.post('/postIdea', function(req, res) {
        var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
            i18n.init(req, res);
    req.setLocale(locale);


    var currentUser = req.session.user;
    var post = new Post(currentUser.emailAddr, req.body.ideaName,req.body.ideaDesc);
    post.save(function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      req.flash('success', res.__('EW0042'));
      res.redirect('/say');
    });
  });

};

function checkLogin(req, res, next) {
      var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
          i18n.init(req, res);
    req.setLocale(locale);
  if (!req.session.user) {
    req.flash('error', res.__('EW0043'));
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
      var locales=req.headers['accept-language'].split(",");
    locale=locales[0];
          i18n.init(req, res);
    req.setLocale(locale);
  if (req.session.user) {
    req.flash('error', res.__('EW0039'));
    return res.redirect('/');
  }
  next();
}

 function calculateTimes(req, res, next){

    Record.calculateTimes(function(error,times){
      console.log("function:"+times);
      res.render('tree',{
        times: times,
      });
    });
    next();
 }
