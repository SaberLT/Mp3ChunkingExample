using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Streaming.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AudioController : ControllerBase
    {
        [HttpGet("test")]
        public string Test([FromQuery] string data)
        {
            return "test";
            //return new Resp()
            //{
            //    Result = "test"
            //};
        }

        //[HttpGet("loadFile")]
        //public byte[] LoadFile([FromQuery] string file)
        //{
        //    var bytes = System.IO.File.ReadAllBytes($"Audio\\{file}");
        //    return bytes;
        //}


        [HttpGet("loadFile")]
        public FileResult LoadFile([FromQuery] string file)
        {
            var bytes = System.IO.File.ReadAllBytes($"Audio\\{file}");
            return File(bytes, "audio/mpeg");
        }
    }

}